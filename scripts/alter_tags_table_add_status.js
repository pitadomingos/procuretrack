
import * as db from '../backend/db.js';

async function alterTagsTableAddStatus() {
  let connection;
  try {
    connection = await db.pool.getConnection();
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
      // Optionally, you could check if the type/default needs updating, but that's more complex.
      // For now, just ensuring it exists.
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
    // For a script, you might want to end the pool if it's the last operation.
    // await db.pool.end();
  }
}

alterTagsTableAddStatus();
