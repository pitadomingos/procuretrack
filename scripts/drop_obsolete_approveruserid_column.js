
import { getDbPool } from '../backend/db.js';

async function dropObsoleteApproverUserIdColumn() {
  let pool;
  let connection;
  try {
    pool = await getDbPool();
    connection = await pool.getConnection();
    const dbName = connection.config.database;

    const checkColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'PurchaseOrder' 
      AND COLUMN_NAME = 'approverUserId';
    `;
    const [columnRows] = await connection.execute(checkColumnQuery, [dbName]);

    if (columnRows[0].count === 0) {
      console.log("Column 'approverUserId' (obsolete) not found in PurchaseOrder table. No drop needed.");
      return;
    }

    const checkFkQuery = `
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'PurchaseOrder'
        AND COLUMN_NAME = 'approverUserId'
        AND REFERENCED_TABLE_NAME IS NOT NULL;
    `;
    const [fkRows] = await connection.execute(checkFkQuery, [dbName]);

    if (fkRows.length > 0) {
      for (const row of fkRows) {
        const constraintName = row.CONSTRAINT_NAME;
        console.log(`Found foreign key constraint '${constraintName}' on column 'approverUserId'. Attempting to drop it first.`);
        try {
          await connection.execute(`ALTER TABLE PurchaseOrder DROP FOREIGN KEY ${constraintName};`);
          console.log(`Successfully dropped foreign key constraint '${constraintName}'.`);
        } catch (dropFkError) {
          console.error(`Failed to drop foreign key constraint '${constraintName}'. Error: ${dropFkError.message}. Please resolve manually.`);
          return; // Stop if we can't drop a FK
        }
      }
    }

    console.log("Attempting to drop column 'approverUserId' from PurchaseOrder table...");
    const dropColumnQuery = `
      ALTER TABLE PurchaseOrder
      DROP COLUMN approverUserId;
    `;
    await connection.execute(dropColumnQuery);
    console.log("Successfully dropped column 'approverUserId' from PurchaseOrder table.");

  } catch (error) {
    console.error("Error during the process of dropping 'approverUserId' column:", error.message);
  } finally {
    if (connection) connection.release();
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

dropObsoleteApproverUserIdColumn();
