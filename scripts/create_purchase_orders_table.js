
import { getDbPool } from '../backend/db.js';

async function createPurchaseOrderTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE PurchaseOrder (
          id INT AUTO_INCREMENT PRIMARY KEY,
          poNumber VARCHAR(255) UNIQUE NOT NULL,
          creationDate DATETIME NOT NULL,
          creatorUserId VARCHAR(255) NULL,      -- Firebase User ID, NULLABLE for now
          requestedByName VARCHAR(255) NULL,     -- Free-text requester name
          supplierId VARCHAR(255),              -- References Supplier.supplierCode
          approverId VARCHAR(255),              -- References Approver.id (This is for who is ASSIGNED to approve)
          siteId INT NULL,                      -- Overall PO Site ID (Re-added based on user DB image)
          status VARCHAR(255) NOT NULL,
          subTotal DECIMAL(10, 2),
          vatAmount DECIMAL(10, 2),
          grandTotal DECIMAL(10, 2),
          currency VARCHAR(50),
          pricesIncludeVat BOOLEAN,
          notes TEXT,
          approvalDate DATETIME NULL,           -- Date when the PO was approved
          FOREIGN KEY (creatorUserId) REFERENCES User(id) ON DELETE SET NULL,
          FOREIGN KEY (supplierId) REFERENCES Supplier(supplierCode) ON DELETE RESTRICT,
          FOREIGN KEY (approverId) REFERENCES Approver(id) ON DELETE RESTRICT,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL -- FK for overall siteId (Re-added)
      );
    `;
    await pool.execute(createTableQuery);
    console.log('PurchaseOrder table created or verified successfully with overall siteId column.');
  } catch (error) {
    console.error('Error creating/updating PurchaseOrder table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createPurchaseOrderTable();
