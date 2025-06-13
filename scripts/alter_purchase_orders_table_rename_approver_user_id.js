
import * as db from '../backend/db.js';

async function renameOldAssignedApproverColumn() {
  let connection;
  try {
    connection = await db.pool.getConnection();
    const dbName = connection.config.database;

    // Check if the source column 'approvedByUserId' (old name for assigned approver) exists
    const checkOldColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'PurchaseOrder' 
      AND COLUMN_NAME = 'approvedByUserId';
    `;
    const [oldColumnRows] = await connection.execute(checkOldColumnQuery, [dbName]);

    if (oldColumnRows[0].count === 0) {
      console.log("Column 'approvedByUserId' (the old name for the assigned approver ID) was not found in PurchaseOrder table.");
      
      // Check if the target column 'approverId' already exists
      const checkNewColumnQuery = `
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'PurchaseOrder' 
        AND COLUMN_NAME = 'approverId';
      `;
      const [newColumnRows] = await connection.execute(checkNewColumnQuery, [dbName]);
      if (newColumnRows[0].count > 0) {
        console.log("The target column 'approverId' already exists. No rename operation needed from 'approvedByUserId'.");
      } else {
        console.log("Neither 'approvedByUserId' (old name) nor 'approverId' (new name for assigned approver) seems to exist. The column for assigned approver might be missing or named differently.");
      }
      if (connection) connection.release();
      return;
    }

    // If old 'approvedByUserId' exists, proceed to check if 'approverId' also exists (conflict or already done)
    const checkTargetColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'PurchaseOrder' 
      AND COLUMN_NAME = 'approverId';
    `;
    const [targetColumnRows] = await connection.execute(checkTargetColumnQuery, [dbName]);

    if (targetColumnRows[0].count > 0) {
      console.log("Column 'approvedByUserId' (old name) and 'approverId' (target name) both exist. This script cannot resolve this conflict. Manual check required. It's possible the rename is not needed or refers to a different 'approvedByUserId'.");
      if (connection) connection.release();
      return;
    }
    
    // If old 'approvedByUserId' exists and 'approverId' does not, then attempt rename
    const renameColumnQuery = `
      ALTER TABLE PurchaseOrder
      CHANGE COLUMN approvedByUserId approverId VARCHAR(255);
    `;
    await connection.execute(renameColumnQuery);
    console.log("Successfully renamed column 'approvedByUserId' to 'approverId' in PurchaseOrder table.");

  } catch (error) {
    console.error('Error during renaming process in PurchaseOrder table:', error.message);
    // For detailed debugging: console.error(error);
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
    // For a script, you might want to end the pool if it's the last operation.
    // await db.pool.end(); 
  }
}

renameOldAssignedApproverColumn();
