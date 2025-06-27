
import { getDbPool } from '../backend/db.js';

async function alterPurchaseOrdersTableUpdateApproverFk() {
  let pool;
  let connection;
  try {
    pool = await getDbPool();
    connection = await pool.getConnection();
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
      return;
    }

    // Define potential old constraint names to try to drop from approverId
    const oldConstraintNamesToTryDrop = ['fk_po_approved_by_user', 'PurchaseOrder_ibfk_5']; 

    for (const constraintName of oldConstraintNamesToTryDrop) {
      const checkConstraintQuery = `
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = ? 
          AND TABLE_NAME = 'PurchaseOrder' 
          AND COLUMN_NAME = 'approverId' 
          AND CONSTRAINT_NAME = ?;
      `;
      const [constraintRows] = await connection.execute(checkConstraintQuery, [dbName, constraintName]);

      if (constraintRows.length > 0) {
        try {
          const dropFkQuery = `ALTER TABLE PurchaseOrder DROP FOREIGN KEY ${constraintName};`;
          await connection.execute(dropFkQuery);
          console.log(`Successfully dropped foreign key constraint ${constraintName} from approverId column.`);
        } catch (error) {
          console.warn(`Could not drop foreign key constraint ${constraintName}. It might have been dropped already or is not on approverId. Error: ${error.message}`);
        }
      } else {
        console.log(`Constraint ${constraintName} not found on approverId column.`);
      }
    }
    
    // Add the new foreign key constraint referencing the Approver table if it doesn't exist
    const newConstraintNameApproverTable = 'fk_po_approver';
    const checkNewConstraintQuery = `
      SELECT COUNT(*) AS count 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'PurchaseOrder' 
        AND CONSTRAINT_NAME = ? 
        AND CONSTRAINT_TYPE = 'FOREIGN KEY';
    `;
    const [newConstraintRows] = await connection.execute(checkNewConstraintQuery, [dbName, newConstraintNameApproverTable]);

    if (newConstraintRows[0].count === 0) {
      const addFkQuery = `
        ALTER TABLE PurchaseOrder
        ADD CONSTRAINT ${newConstraintNameApproverTable}
        FOREIGN KEY (approverId) REFERENCES Approver(id) ON DELETE RESTRICT;
      `;
      try {
        await connection.execute(addFkQuery);
        console.log(`Added new foreign key constraint ${newConstraintNameApproverTable} on approverId referencing Approver(id).`);
      } catch (addError) {
        console.error(`Failed to add foreign key ${newConstraintNameApproverTable}. Error: ${addError.message}`);
        await connection.rollback();
        throw addError;
      }
    } else {
      console.log(`Foreign key constraint ${newConstraintNameApproverTable} on approverId already exists.`);
    }
    
    await connection.commit();
    console.log('PurchaseOrder table foreign key update for approverId to Approver(id) processed.');

  } catch (error) {
    if (connection && connection.connection._closing === false) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
        }
    }
    console.error('Error updating PurchaseOrder table foreign key for approverId to Approver(id):', error.message);
  } finally {
    if (connection) connection.release();
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

alterPurchaseOrdersTableUpdateApproverFk();
