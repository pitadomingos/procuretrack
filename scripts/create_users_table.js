
import { getDbPool } from '../backend/db.js';

async function createUserTable() {
  let pool;
  try {
    pool = await getDbPool();
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
    await pool.execute(createTableQuery);
    console.log('User table created successfully.');
  } catch (error) {
    console.error('Error creating User table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createUserTable();
