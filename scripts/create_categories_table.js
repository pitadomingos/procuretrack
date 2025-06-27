
import { getDbPool } from '../backend/db.js';

async function createCategoryTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE Category (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category VARCHAR(255) NOT NULL
      );
    `;
    await pool.execute(createTableQuery);
    console.log('Category table created successfully.');
  } catch (error) {
    console.error('Error creating Category table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createCategoryTable();
