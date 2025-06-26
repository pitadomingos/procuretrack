import * as db from '../backend/db.js';

async function createUserTable() {
  try {
    const createTableQuery = `
      CREATE TABLE User (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          password VARCHAR(255) NOT NULL,
          role VARCHAR(255),
          isActive BOOLEAN
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('User table created successfully.');
  } catch (error) {
    console.error('Error creating User table:', error);
  } finally {
    // pool.end();
  }
}

createUserTable();
