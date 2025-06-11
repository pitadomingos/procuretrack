
import * as db from '../backend/db.js';

async function createPurchaseOrderTable() {
  try {
    // Note: It's good practice to drop dependent tables (like POItem) first if they exist
    // and PurchaseOrder is being recreated with structural changes that might break foreign keys.
    // Or, alter existing tables if data preservation is key.
    // For this script, we assume it's safe to drop and recreate or it's the first run.
    
    // await db.pool.execute('DROP TABLE IF EXISTS POItem;'); // Optional: if POItem depends on it and schema changes
    // await db.pool.execute('DROP TABLE IF EXISTS PurchaseOrder;'); // Optional: if recreating

    const createTableQuery = `
      CREATE TABLE PurchaseOrder (
          id INT AUTO_INCREMENT PRIMARY KEY,
          poNumber VARCHAR(255) UNIQUE NOT NULL,
          creationDate DATETIME NOT NULL,
          creatorUserId VARCHAR(255) NULL,  -- Changed to NULLABLE, will store Firebase User ID
          requestedByName VARCHAR(255) NULL, -- New field for the free-text requester name
          supplierId VARCHAR(255),          -- References Supplier.supplierCode
          approverId VARCHAR(255),          -- Renamed from approverUserId, references Approver.id
          siteId INT NULL,                  -- Overall PO Site ID, NULLABLE
          status VARCHAR(255) NOT NULL,
          subTotal DECIMAL(10, 2),
          vatAmount DECIMAL(10, 2),
          grandTotal DECIMAL(10, 2),
          currency VARCHAR(50),
          pricesIncludeVat BOOLEAN,
          notes TEXT,
          approvalDate DATETIME NULL,
          approvedByUserId VARCHAR(255) NULL, -- This seems to be for who *finally* approved, might need to be Approver.id too or User.id if a user performs final approval action
          FOREIGN KEY (creatorUserId) REFERENCES User(id) ON DELETE SET NULL, -- Keep if creator MUST be a system user eventually. ON DELETE SET NULL if User deleted
          FOREIGN KEY (supplierId) REFERENCES Supplier(supplierCode) ON DELETE RESTRICT,
          FOREIGN KEY (approverId) REFERENCES Approver(id) ON DELETE RESTRICT, -- Changed to Approver(id)
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL,
          FOREIGN KEY (approvedByUserId) REFERENCES User(id) ON DELETE SET NULL -- Similar to creatorUserId, if final approver is a system user.
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('PurchaseOrder table created or verified successfully with new schema.');
  } catch (error) {
    console.error('Error creating/updating PurchaseOrder table:', error);
  } finally {
    // pool.end(); // Only if this script is run standalone and no other DB operations follow.
  }
}

createPurchaseOrderTable();
