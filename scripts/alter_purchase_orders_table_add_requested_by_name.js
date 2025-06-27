
import { getDbPool } from '../backend/db.js';

async function alterPurchaseOrdersTableAddRequestedByName() {
  let pool;
  try {
    pool = await getDbPool();
    const addColumnQuery = `
      ALTER TABLE PurchaseOrder
      ADD COLUMN requestedByName VARCHAR(255);
    `;
    await pool.execute(addColumnQuery);
    console.log('Added requestedByName column to PurchaseOrder table.');

    console.log('PurchaseOrder table altered successfully.');

  } catch (error) {
    console.error('Error altering PurchaseOrder table:', error);
  } finally {
    if (pool) {
        await pool.end();
        console.log('Database pool ended for script.');
    }
  }
}

alterPurchaseOrdersTableAddRequestedByName();
