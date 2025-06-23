
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct absolute path to .env file in the parent directory
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

// Construct absolute path to ca.pem file in the same directory
const caPath = path.resolve(__dirname, "ca.pem");
let caCert;

try {
  if (!fs.existsSync(caPath)) {
    console.error(`CRITICAL_DB_INIT_ERROR: CA certificate file (ca.pem) not found at expected location: ${caPath}. Database connections requiring SSL will likely fail. Please ensure 'backend/ca.pem' exists.`);
    // caCert will remain undefined. mysql.createPool might fail if SSL is strictly required.
  } else {
    caCert = fs.readFileSync(caPath, 'utf8');
  }
} catch (e) {
  console.error(`CRITICAL_DB_INIT_ERROR: Error reading CA certificate file (ca.pem) at ${caPath}: ${e.message}. Database connections may fail.`);
  // Depending on the error, caCert might be undefined or an error could be thrown, halting further execution.
  // For robustness, we could choose to throw here to make the failure explicit.
  // throw new Error(`Failed to read ca.pem: ${e.message}`);
}

// Check for essential DB environment variables
const essentialEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = essentialEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
    console.error(`CRITICAL_DB_INIT_ERROR: Missing essential database environment variables: ${missingEnvVars.join(', ')}. These should be defined in backend/.env for local development or configured in your hosting environment. Database connections will fail.`);
    // To make the server fail fast and clearly, throwing an error here is a good practice.
    // This prevents a more obscure "Internal Server Error" later.
    throw new Error(`Missing critical DB environment variables: ${missingEnvVars.join(', ')}. Check your backend/.env file or hosting configuration.`);
}

let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    ssl: {
      ca: caCert, // If caCert is undefined due to file not found, this may cause issues
      rejectUnauthorized: true, // Recommended for production if using a trusted CA
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("DB_INIT_SUCCESS: MySQL connection pool created (this does not guarantee successful connection yet, but configuration is loaded).");
} catch (error) {
  console.error(`CRITICAL_DB_INIT_ERROR: Failed to create MySQL connection pool: ${error.message}. This is a fatal error for database operations.`);
  // Re-throwing the error here will make the application fail on startup if the pool cannot be initialized,
  // which is often better than encountering errors later during request handling.
  throw new Error(`Failed to initialize database connection pool due to: ${error.message}. Review DB configuration (backend/.env) and SSL certificate (backend/ca.pem).`);
}

// Export the connection pool
export {pool};
