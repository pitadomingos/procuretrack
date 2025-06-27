
import { getDbPool } from '../backend/db.js';

async function alterTagsTableAddStatus() {
  let pool;
  let connection;
  try {
    pool = await getDbPool();
    connection = await pool.getConnection();
    const dbName = connection.config.database;

    // Check if the 'status' column exists
    const checkColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'Tag'
      AND COLUMN_NAME = 'status';
    `;
    const [columnRows] = await connection.execute(checkColumnQuery, [dbName]);

    if (columnRows[0].count === 0) {
      console.log("Column 'status' not found in Tag table. Attempting to add it...");
      const addColumnQuery = `
        ALTER TABLE Tag
        ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Active' AFTER type;
      `;
      await connection.execute(addColumnQuery);
      console.log("Successfully added 'status' column (VARCHAR(50) NOT NULL DEFAULT 'Active') to Tag table.");
    } else {
      console.log("Column 'status' already exists in Tag table. No alteration needed for column addition.");
    }

  } catch (error) {
    console.error("Error during the process of adding/checking 'status' column in Tag table:", error.message);
  } finally {
    if (connection) {
      try {
        connection.release();
        console.log('Database connection released.');
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

alterTagsTableAddStatus();
