import * as db from '../backend/db.js';

async function createPurchaseOrderTable() {
  try {
    const createTableQuery = `
      CREATE TABLE PurchaseOrder (
          id INT AUTO_INCREMENT PRIMARY KEY,
          poNumber VARCHAR(255) UNIQUE NOT NULL,
          creationDate DATETIME NOT NULL,
          creatorUserId VARCHAR(255),
          supplierId VARCHAR(255),
          approverUserId VARCHAR(255),
          siteId INT,
          status VARCHAR(255) NOT NULL,
          subTotal DECIMAL(10, 2),
          vatAmount DECIMAL(10, 2),
          grandTotal DECIMAL(10, 2),
          currency VARCHAR(50),
          pricesIncludeVat BOOLEAN,
          notes TEXT,
          approvalDate DATETIME,
          approvedByUserId VARCHAR(255),
          FOREIGN KEY (creatorUserId) REFERENCES User(id),
          FOREIGN KEY (supplierId) REFERENCES Supplier(supplierCode),
          FOREIGN KEY (approverUserId) REFERENCES User(id),
          FOREIGN KEY (siteId) REFERENCES Site(id),
          FOREIGN KEY (approvedByUserId) REFERENCES User(id)
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('PurchaseOrder table created successfully.');
  } catch (error) {
    console.error('Error creating PurchaseOrder table:', error);
  } finally {
    // pool.end();
  }
}

createPurchaseOrderTable();