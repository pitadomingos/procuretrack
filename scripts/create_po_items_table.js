
import { getDbPool } from '../backend/db.js';

async function createPOItemTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE POItem (
          id INT AUTO_INCREMENT PRIMARY KEY,
          poId INT,
          partNumber VARCHAR(255),
          description TEXT NOT NULL,
          categoryId INT,
          uom VARCHAR(50),
          quantity DECIMAL(10, 2) NOT NULL,
          unitPrice DECIMAL(10, 2) NOT NULL,
          siteId INT NULL,
          quantityReceived DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
          itemStatus VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- e.g., 'Pending', 'Partially Received', 'Fully Received', 'Cancelled'
          FOREIGN KEY (poId) REFERENCES PurchaseOrder(id) ON DELETE CASCADE,
          FOREIGN KEY (categoryId) REFERENCES Category(id),
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL
      );
    `;
    await pool.execute(createTableQuery);
    console.log('POItem table created successfully with quantityReceived and itemStatus columns.');
  } catch (error) {
    console.error('Error creating POItem table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createPOItemTable();
