
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Check for essential DB environment variables
const essentialEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = essentialEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
    const errorMessage = `CRITICAL_DB_INIT_ERROR: Missing essential database environment variables: ${missingEnvVars.join(', ')}. Please define these in your root .env file. Database connections will fail until this is resolved.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

// --- SSL Certificate Handling ---
// The CA certificate can be provided as a file path or direct content in the DB_SSL_CA environment variable.
const caCertPathOrContent = process.env.DB_SSL_CA;
let caCertContent;

if (caCertPathOrContent) {
    // Determine if DB_SSL_CA is a file path or the certificate content itself.
    const potentialPath = path.resolve(process.cwd(), caCertPathOrContent);
    
    // Check if the path exists and is a file.
    if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
        console.log(`DB_INIT_INFO: DB_SSL_CA points to a file. Reading certificate from "${potentialPath}".`);
        try {
            caCertContent = fs.readFileSync(potentialPath, 'utf8');
        } catch (readError) {
            const errorMessage = `CRITICAL_DB_INIT_ERROR: Failed to read SSL certificate file at "${potentialPath}". Error: ${readError.message}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    } else {
        // If it's not a path to a file, assume it's the certificate content.
        console.log("DB_INIT_INFO: DB_SSL_CA does not appear to be a file path. Using its content directly for SSL connection.");
        caCertContent = caCertPathOrContent;
    }
} else {
    console.warn(`DB_WARN: The DB_SSL_CA environment variable is not set. Connecting with SSL using system default CAs. If connection fails, please provide the certificate content or the path to your 'ca.pem' file in the .env file.`);
}

// Modern cloud databases like TiDB Cloud require SSL. This configuration enables it.
const sslConfig = { 
    // If a CA cert is provided (from file or content), use it.
    // Otherwise, mysql2 will use the system's trusted CAs.
    ca: caCertContent || undefined 
};

// --- Connection Pool Creation ---
console.log("DB_INIT_INFO: Attempting to connect with SSL enabled by default.");

let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    ssl: sslConfig, // Always pass the ssl object to enable SSL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("DB_INIT_SUCCESS: MySQL connection pool created (this does not guarantee successful connection yet, but configuration is loaded).");
} catch (error) {
  console.error(`CRITICAL_DB_INIT_ERROR: Failed to create MySQL connection pool: ${error.message}. This is a fatal error for database operations.`);
  throw new Error(`Failed to initialize database connection pool due to: ${error.message}. Review DB environment variables.`);
}

// Export the connection pool
export { pool };
