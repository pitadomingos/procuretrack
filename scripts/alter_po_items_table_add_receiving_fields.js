
import { getDbPool } from '../backend/db.js';

async function alterPOItemsTableAddReceivingFields() {
  let pool;
  let connection;
  try {
    pool = await getDbPool();
    connection = await pool.getConnection();
    console.log('Attempting to alter POItem table...');

    // Check if quantityReceived column exists
    const [qrRows] = await connection.execute(`
      SELECT COUNT(*) AS count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'POItem' 
      AND COLUMN_NAME = 'quantityReceived';
    `);

    if (qrRows[0].count === 0) {
      const addQuantityReceivedQuery = `
        ALTER TABLE POItem
        ADD COLUMN quantityReceived DECIMAL(10, 2) DEFAULT 0.00 NOT NULL;
      `;
      await connection.execute(addQuantityReceivedQuery);
      console.log('Added quantityReceived column to POItem table.');
    } else {
      console.log('quantityReceived column already exists in POItem table.');
    }

    // Check if itemStatus column exists
    const [isRows] = await connection.execute(`
      SELECT COUNT(*) AS count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'POItem' 
      AND COLUMN_NAME = 'itemStatus';
    `);
    
    if (isRows[0].count === 0) {
      const addItemStatusQuery = `
        ALTER TABLE POItem
        ADD COLUMN itemStatus VARCHAR(50) DEFAULT 'Pending' NOT NULL;
      `;
      await connection.execute(addItemStatusQuery);
      console.log('Added itemStatus column to POItem table.');
    } else {
      console.log('itemStatus column already exists in POItem table.');
    }

    console.log('POItem table alteration script completed successfully.');

  } catch (error) {
    console.error('Error altering POItem table:', error);
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

alterPOItemsTableAddReceivingFields();
