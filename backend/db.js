
import mysql from 'mysql2/promise';

// Check for essential DB environment variables
const essentialEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = essentialEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
    const errorMessage = `CRITICAL_DB_INIT_ERROR: Missing essential database environment variables: ${missingEnvVars.join(', ')}. Please define these in your root .env file. Database connections will fail until this is resolved.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

// The CA certificate content is now expected to be in an environment variable.
const caCert = process.env.DB_SSL_CA;

// Modern cloud databases like TiDB Cloud require SSL. This configuration enables it.
const sslConfig = { 
    // If a CA cert is provided in the .env file, use it.
    // Otherwise, mysql2 will use the system's trusted CAs.
    ca: caCert || undefined 
};

console.log("DB_INIT_INFO: Attempting to connect with SSL enabled by default.");
if (caCert) {
    console.log("DB_INIT_INFO: DB_SSL_CA variable found and will be used for SSL connection.");
} else {
    console.warn(`DB_WARN: The DB_SSL_CA environment variable is not set. Connecting with SSL using system default CAs. If connection fails, please ensure you have provided the correct CA certificate content in the .env file for your database provider.`);
}

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
