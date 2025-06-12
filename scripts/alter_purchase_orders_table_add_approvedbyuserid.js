
import * as db from '../backend/db.js';

async function alterPurchaseOrdersTableAddApprovedByUserId() {
  let connection;
  try {
    connection = await db.pool.getConnection();
    await connection.beginTransaction();

    const dbName = connection.config.database; // Get current database name

    const checkColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'PurchaseOrder'
      AND COLUMN_NAME = 'approvedByUserId';
    `;
    const [rows] = await connection.execute(checkColumnQuery, [dbName]);

    if (rows[0].count === 0) {
      console.log('approvedByUserId column does not exist in PurchaseOrder table. Adding it...');
      // Add column
      const addColumnSql = \`
        ALTER TABLE PurchaseOrder
        ADD COLUMN approvedByUserId VARCHAR(255) NULL;
      \`;
      await connection.execute(addColumnSql);
      console.log('approvedByUserId column added.');

      // Add foreign key constraint
      // First, check if User table exists to avoid error during constraint creation if User table is missing for some reason
      const checkUserTableQuery = `
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'User';
      `;
      const [userTableRows] = await connection.execute(checkUserTableQuery, [dbName]);

      if (userTableRows[0].count > 0) {
        const addForeignKeySql = \`
          ALTER TABLE PurchaseOrder
          ADD CONSTRAINT fk_po_approved_by_user
          FOREIGN KEY (approvedByUserId) REFERENCES User(id) ON DELETE SET NULL;
        \`;
        await connection.execute(addForeignKeySql);
        console.log('Foreign key constraint fk_po_approved_by_user for approvedByUserId added.');
      } else {
        console.warn('User table does not exist. Foreign key for approvedByUserId cannot be added. Please ensure User table is created first.');
      }
    } else {
      console.log('approvedByUserId column already exists in PurchaseOrder table.');
    }

    await connection.commit();
    console.log('PurchaseOrder table schema check/update for approvedByUserId complete.');

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error altering PurchaseOrder table for approvedByUserId:', error);
  } finally {
    if (connection) connection.release();
    // For a script, you might want to end the pool if it's the last operation.
    // Consider if other scripts run sequentially.
    // await db.pool.end(); 
  }
}

alterPurchaseOrdersTableAddApprovedByUserId();
