import * as db from '../backend/db.js';

async function alterPurchaseOrdersTableUpdateApproverFk() {
  try {
    // Drop the existing foreign key constraint (using the name from the error message)
    const dropFkQuery = `
      ALTER TABLE PurchaseOrder
      DROP FOREIGN KEY PurchaseOrder_ibfk_5;
    `;
    await db.pool.execute(dropFkQuery);
    console.log('Dropped existing foreign key constraint PurchaseOrder_ibfk_5 on approverId in PurchaseOrder table.');

    // Add a new foreign key constraint referencing the Approver table
    const addFkQuery = `
      ALTER TABLE PurchaseOrder
      ADD CONSTRAINT fk_po_approver
      FOREIGN KEY (approverId) REFERENCES Approver(id);
    `;
    await db.pool.execute(addFkQuery);
    console.log('Added new foreign key constraint fk_po_approver on approverId referencing Approver table.');

    console.log('PurchaseOrder table foreign key updated successfully.');

  } catch (error) {
    console.error('Error updating PurchaseOrder table foreign key:', error);
  } finally {
    // Consider if you want to close the pool here
    // db.pool.end();
  }
}

alterPurchaseOrdersTableUpdateApproverFk();
