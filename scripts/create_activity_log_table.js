import { pool } from '../backend/db.js';

async function createActivityLogTable() {
  try {
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
    // In a script, you might want to end the process after execution,
    // but if running multiple scripts sequentially, keep the pool open.
    // For a simple single script execution:
    // pool.end(); // Only call pool.end() when you're completely done with all database operations.
  }
}

createActivityLogTable();