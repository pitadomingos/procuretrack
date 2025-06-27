
import { getDbPool } from '../backend/db.js';

async function createActivityLogTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE ActivityLog (
          id VARCHAR(255) PRIMARY KEY,
          user VARCHAR(255) NOT NULL,
          action VARCHAR(255) NOT NULL,
          timestamp DATETIME NOT NULL,
          details TEXT
      );
    `;
    await pool.execute(createTableQuery);
    console.log('ActivityLog table created successfully.');
  } catch (error) {
    console.error('Error creating ActivityLog table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createActivityLogTable();
