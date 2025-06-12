import * as db from '../backend/db.js';

async function alterPurchaseOrdersTableAddRequestedByName() {
  try {
    const addColumnQuery = `
      ALTER TABLE PurchaseOrder
      ADD COLUMN requestedByName VARCHAR(255);
    `;
    await db.pool.execute(addColumnQuery);
    console.log('Added requestedByName column to PurchaseOrder table.');

    console.log('PurchaseOrder table altered successfully.');

  } catch (error) {
    console.error('Error altering PurchaseOrder table:', error);
  } finally {
    // Consider if you want to close the pool here
    // db.pool.end();
  }
}

alterPurchaseOrdersTableAddRequestedByName();