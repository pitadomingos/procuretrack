
import * as db from '../backend/db.js';

async function alterPurchaseOrdersTableUpdateApproverFk() {
  let connection;
  try {
    connection = await db.pool.getConnection();
    await connection.beginTransaction();
    const dbName = connection.config.database;

    // Check if approverId column exists
    const checkApproverIdColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'PurchaseOrder' AND COLUMN_NAME = 'approverId';
    `;
    const [approverIdRows] = await connection.execute(checkApproverIdColumnQuery, [dbName]);

    if (approverIdRows[0].count === 0) {
      console.log('Column approverId does not exist in PurchaseOrder table. Skipping FK update for it.');
      await connection.commit();
      if (connection) connection.release();
      return;
    }

    // Define potential old constraint names
    const oldConstraintNamesToTryDrop = ['fk_po_approved_by_user', 'PurchaseOrder_ibfk_5'];

    for (const constraintName of oldConstraintNamesToTryDrop) {
      try {
        const dropFkQuery = `ALTER TABLE PurchaseOrder DROP FOREIGN KEY ${constraintName};`;
        await connection.execute(dropFkQuery);
        console.log(`Successfully dropped foreign key constraint ${constraintName} (if it existed).`);
      } catch (error) {
        if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.warn(`Foreign key constraint ${constraintName} not found or could not be dropped. This might be okay if it was already removed or named differently.`);
        } else {
          // For other errors, it's better to rollback and throw
          await connection.rollback();
          if (connection) connection.release();
          throw error;
        }
      }
    }

    // Add the new foreign key constraint referencing the Approver table
    const newConstraintNameApproverTable = 'fk_po_approver';
    const addFkQuery = `
      ALTER TABLE PurchaseOrder
      ADD CONSTRAINT ${newConstraintNameApproverTable}
      FOREIGN KEY (approverId) REFERENCES Approver(id) ON DELETE RESTRICT;
    `;
    try {
      await connection.execute(addFkQuery);
      console.log(`Added new foreign key constraint ${newConstraintNameApproverTable} on approverId referencing Approver(id).`);
    } catch (addError) {
      if (addError.code === 'ER_FK_DUP_NAME' || (addError.code === 'ER_CANNOT_ADD_FOREIGN' && addError.sqlMessage.includes('already exists'))) {
         console.warn(`Could not add foreign key ${newConstraintNameApproverTable}. It likely already exists. Message: ${addError.sqlMessage}`);
      } else {
        await connection.rollback();
        if (connection) connection.release();
        throw addError;
      }
    }
    
    await connection.commit();
    console.log('PurchaseOrder table foreign key update for approverId to Approver(id) processed.');

  } catch (error) {
    if (connection && connection.connection._closing === false) { // Check if connection is still open before rollback
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
        }
    }
    console.error('Error updating PurchaseOrder table foreign key for approverId to Approver(id):', error.message);
    // Optionally log the full error for more details: console.error(error);
  } finally {
    if (connection) {
        try {
            connection.release();
        } catch (releaseError) {
            console.error('Error releasing connection:', releaseError);
        }
    }
    // It's often better to let the main application manage pool.end()
    // For a standalone script, you might end it, but ensure all operations are done.
    // await db.pool.end(); 
  }
}

alterPurchaseOrdersTableUpdateApproverFk();
