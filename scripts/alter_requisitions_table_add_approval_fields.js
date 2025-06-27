
import { getDbPool } from '../backend/db.js';

async function alterRequisitionsTableAddApprovalFields() {
  let pool;
  let connection;
  try {
    pool = await getDbPool();
    connection = await pool.getConnection();
    const dbName = connection.config.database;

    // Check if approverId column exists
    const [approverIdRows] = await connection.execute(`
      SELECT COUNT(*) AS count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'Requisition' 
      AND COLUMN_NAME = 'approverId';
    `, [dbName]);

    if (approverIdRows[0].count === 0) {
      const addApproverIdQuery = `
        ALTER TABLE Requisition
        ADD COLUMN approverId VARCHAR(255) NULL AFTER siteId;
      `;
      await connection.execute(addApproverIdQuery);
      console.log('Added approverId column to Requisition table.');
      
      const addApproverFkQuery = `
        ALTER TABLE Requisition
        ADD CONSTRAINT fk_requisition_approver
        FOREIGN KEY (approverId) REFERENCES Approver(id) ON DELETE SET NULL;
      `;
      await connection.execute(addApproverFkQuery);
      console.log('Added foreign key constraint on approverId in Requisition table referencing Approver(id).');

    } else {
      console.log('approverId column already exists in Requisition table.');
    }

    // Check if approvalDate column exists
    const [approvalDateRows] = await connection.execute(`
      SELECT COUNT(*) AS count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'Requisition' 
      AND COLUMN_NAME = 'approvalDate';
    `, [dbName]);
    
    if (approvalDateRows[0].count === 0) {
      const addApprovalDateQuery = `
        ALTER TABLE Requisition
        ADD COLUMN approvalDate DATETIME NULL AFTER approverId;
      `;
      await connection.execute(addApprovalDateQuery);
      console.log('Added approvalDate column to Requisition table.');
    } else {
      console.log('approvalDate column already exists in Requisition table.');
    }

    console.log('Requisition table alteration script for approval fields completed successfully.');

  } catch (error) {
    console.error('Error altering Requisition table for approval fields:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

alterRequisitionsTableAddApprovalFields();
