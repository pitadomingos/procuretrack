
import * as db from '../backend/db.js';

async function createRequisitionItemsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS RequisitionItem (
          id VARCHAR(255) PRIMARY KEY,
          requisitionId VARCHAR(255) NOT NULL,
          partNumber VARCHAR(255) NULL,
          description TEXT NOT NULL,
          categoryId INT NULL,
          siteId INT NULL, -- Added siteId column
          quantity INT NOT NULL,
          estimatedUnitPrice DECIMAL(12, 2) DEFAULT 0.00,
          notes TEXT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (requisitionId) REFERENCES Requisition(id) ON DELETE CASCADE,
          FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE SET NULL,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL -- Added FK for siteId
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('RequisitionItem table created or already exists successfully with siteId column and foreign key.');
  } catch (error) {
    console.error('Error creating RequisitionItem table:', error);
  } finally {
    // pool.end();
  }
}

createRequisitionItemsTable();
