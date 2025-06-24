
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

if (!caCert) {
    console.warn(`DB_WARN: The DB_SSL_CA environment variable is not set. Database connections may fail if SSL is required by your provider. For local development without SSL, this may be ignored.`);
}

let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    // Conditionally add SSL options only if the certificate is provided.
    ...(caCert && {
      ssl: {
        ca: caCert,
        rejectUnauthorized: true, // Recommended for production if using a trusted CA
      }
    }),
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
