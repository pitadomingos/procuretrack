
import { getDbPool } from '../backend/db.js';

async function createRequisitionItemsTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS RequisitionItem (
          id VARCHAR(255) PRIMARY KEY,
          requisitionId VARCHAR(255) NOT NULL,
          partNumber VARCHAR(255) NULL,
          description TEXT NOT NULL,
          categoryId INT NULL,
          siteId INT NULL, 
          quantity INT NOT NULL,
          notes TEXT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (requisitionId) REFERENCES Requisition(id) ON DELETE CASCADE,
          FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE SET NULL,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL
      );
    `;
    await pool.execute(createTableQuery);
    console.log('RequisitionItem table created or already exists successfully (schema includes siteId).');
  } catch (error) {
    console.error('Error creating RequisitionItem table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createRequisitionItemsTable();
