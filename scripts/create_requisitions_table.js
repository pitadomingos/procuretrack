
import { getDbPool } from '../backend/db.js';

async function createRequisitionsTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Requisition (
          id VARCHAR(255) PRIMARY KEY,
          requisitionNumber VARCHAR(255) UNIQUE NOT NULL,
          requisitionDate DATETIME NOT NULL,
          requestedByUserId VARCHAR(255) NULL,
          requestedByName VARCHAR(255) NOT NULL,
          siteId INT NULL,
          status VARCHAR(50) DEFAULT 'Draft',
          justification TEXT NULL,
          totalEstimatedValue DECIMAL(12, 2) DEFAULT 0.00,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (requestedByUserId) REFERENCES User(id) ON DELETE SET NULL,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL
      );
    `;
    await pool.execute(createTableQuery);
    console.log('Requisition table created or already exists successfully.');
  } catch (error) {
    console.error('Error creating Requisition table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createRequisitionsTable();
