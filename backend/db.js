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

// Read the CA certificate file
const caCert = fs.readFileSync(caPath, 'utf8'); // Read as utf8 string for compatibility

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Use process.env directly after dotenv.config
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Default MySQL port
  ssl: {
    ca: caCert,
    rejectUnauthorized: true, // Recommended for production if using a trusted CA
  },
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

// Export the connection pool
export {pool};