import * as db from '../backend/db.js';

async function createCategoryTable() {
  try {
    const createTableQuery = `
      CREATE TABLE Category (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category VARCHAR(255) NOT NULL
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('Category table created successfully.');
  } catch (error) {
    console.error('Error creating Category table:', error);
  } finally {
    // pool.end();
  }
}

createCategoryTable();