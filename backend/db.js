
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let pool = null;

async function getDbPool() {
  if (pool) {
    return pool;
  }

  // This logic now runs only on the first API call that needs the DB
  try {
    // Check for essential DB environment variables
    const essentialEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingEnvVars = essentialEnvVars.filter(v => !process.env[v]);
    
    if (missingEnvVars.length > 0) {
      throw new Error(`CRITICAL_DB_INIT_ERROR: Missing essential database environment variables: ${missingEnvVars.join(', ')}. Please define these in your root .env file.`);
    }

    // --- SSL Certificate Handling ---
    const caCertPathOrContent = process.env.DB_SSL_CA;
    let caCertContent;

    if (caCertPathOrContent) {
      const potentialPath = path.resolve(process.cwd(), caCertPathOrContent);
      
      if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
        console.log(`DB_INIT_INFO: DB_SSL_CA points to a file. Reading certificate from "${potentialPath}".`);
        caCertContent = fs.readFileSync(potentialPath, 'utf8');
      } else {
        console.log("DB_INIT_INFO: DB_SSL_CA does not appear to be a file path. Using its content directly for SSL connection.");
        caCertContent = caCertPathOrContent;
      }
    } else {
      console.warn(`DB_WARN: The DB_SSL_CA environment variable is not set. Connecting with SSL using system default CAs. If connection fails, please provide the path to your 'ca.pem' file in the DB_SSL_CA variable in your .env file.`);
    }
    
    const sslConfig = { ca: caCertContent || undefined };

    // --- Connection Pool Creation ---
    console.log("DB_INIT_INFO: Creating database connection pool for the first time.");
    const newPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      ssl: sslConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection before assigning it to the singleton
    const connection = await newPool.getConnection();
    console.log("DB_INIT_SUCCESS: Database connection pool created and verified successfully.");
    connection.release();

    pool = newPool;
    return pool;
    
  } catch (error) {
    console.error(`CRITICAL_DB_INIT_ERROR: Failed to create and verify database connection pool. Error: ${error.message}`);
    // Re-throw the error to be caught by the calling API route
    throw error;
  }
}

// Export the function that provides the pool
export { getDbPool };
