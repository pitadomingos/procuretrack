
import * as db from '../backend/db.js';

async function createClientsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Client (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NULL,
          contactPerson VARCHAR(255) NULL,
          contactNumber VARCHAR(50) NULL,
          address TEXT NULL,
          nuit VARCHAR(50) NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('Client table created or already exists successfully.');
  } catch (error) {
    console.error('Error creating Client table:', error);
  } finally {
    // pool.end(); // End pool if script is standalone and no other operations follow
  }
}

createClientsTable();
