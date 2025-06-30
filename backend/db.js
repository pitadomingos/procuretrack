
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Configure dotenv to load the .env file from the backend directory at module load time.
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

let pool = null;

async function getDbPool() {
  if (pool) {
    return pool;
  }

  // --- Debugging Environment ---
  console.log('[DB_INIT] Current working directory:', process.cwd());
  console.log('[DB_INIT] Checking for environment variables...');
  
  try {
    // Check for essential DB environment variables
    const essentialEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
    const missingEnvVars = [];
    for (const v of essentialEnvVars) {
        if (!process.env[v]) {
            missingEnvVars.push(v);
        } else {
            // Avoid logging password in production
            if (v !== 'DB_PASSWORD' && v !== 'JWT_SECRET') {
                console.log(`[DB_INIT] Found ENV VAR: ${v} = ${process.env[v]}`);
            } else {
                 console.log(`[DB_INIT] Found ENV VAR: ${v} = (hidden)`);
            }
        }
    }
    
    if (missingEnvVars.length > 0) {
      const errorMsg = `Configuration is incomplete. Missing variables: ${missingEnvVars.join(', ')}. Please define these in your backend/.env file. For JWT_SECRET, use a long, random string.`;
      console.error(`[DB_INIT_ERROR] ${errorMsg}`);
      throw new Error(errorMsg);
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
    
    const sslConfig = { rejectUnauthorized: true, ca: caCertContent || undefined };

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

    try {
      // Test the connection before assigning it to the singleton
      const connection = await newPool.getConnection();
      console.log("DB_INIT_SUCCESS: Database connection pool created and verified successfully.");
      connection.release();
    } catch (testError) {
      console.error("CRITICAL_DB_INIT_ERROR: Failed to get a connection from the pool after creation.", testError);
      // Destroy the pool if the initial connection test fails
      newPool.end();
      throw testError; // Re-throw to be caught by the main catch block
    }

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
