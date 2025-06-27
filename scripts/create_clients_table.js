
import { getDbPool } from '../backend/db.js';

async function createClientsTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Client (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address TEXT NULL,
          city VARCHAR(255) NULL,
          country VARCHAR(255) NULL,
          contactPerson VARCHAR(255) NULL,
          email VARCHAR(255) NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await pool.execute(createTableQuery);
    console.log('Client table created or already exists successfully with updated schema (city, country added; nuit, contactNumber removed).');
  } catch (error) {
    console.error('Error creating Client table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createClientsTable();
