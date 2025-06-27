
import { getDbPool } from '../backend/db.js';

async function alterRequisitionItemsTableDropEstimatedUnitPrice() {
  let pool;
  let connection;
  try {
    pool = await getDbPool();
    connection = await pool.getConnection();
    const dbName = connection.config.database;

    // Check if the 'estimatedUnitPrice' column exists
    const checkColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'RequisitionItem'
      AND COLUMN_NAME = 'estimatedUnitPrice';
    `;
    const [columnRows] = await connection.execute(checkColumnQuery, [dbName]);

    if (columnRows[0].count > 0) {
      console.log("Column 'estimatedUnitPrice' found in RequisitionItem table. Attempting to drop it...");
      const dropColumnQuery = `
        ALTER TABLE RequisitionItem
        DROP COLUMN estimatedUnitPrice;
      `;
      await connection.execute(dropColumnQuery);
      console.log("Successfully dropped 'estimatedUnitPrice' column from RequisitionItem table.");
    } else {
      console.log("Column 'estimatedUnitPrice' not found in RequisitionItem table. No alteration needed for column drop.");
    }

  } catch (error) {
    console.error("Error during the process of dropping 'estimatedUnitPrice' column from RequisitionItem table:", error.message);
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

alterRequisitionItemsTableDropEstimatedUnitPrice();
