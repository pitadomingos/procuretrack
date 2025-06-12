import * as db from '../backend/db.js';

async function renameApproverUserIdColumn() {
  try {
    const renameColumnQuery = `
      ALTER TABLE PurchaseOrder
      CHANGE COLUMN approvedByUserId approverId VARCHAR(255);
    `;
    await db.pool.execute(renameColumnQuery);
    console.log('Renamed approvedByUserId to approverId in PurchaseOrder table successfully.');

  } catch (error) {
    console.error('Error renaming column in PurchaseOrder table:', error);
  } finally {
    // Consider if you want to close the pool here
    // db.pool.end();
  }
}

renameApproverUserIdColumn();