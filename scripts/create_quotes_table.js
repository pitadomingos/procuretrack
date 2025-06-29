
import { getDbPool } from '../backend/db.js';

async function createQuotesTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Quote (
          id VARCHAR(255) PRIMARY KEY,
          quoteNumber VARCHAR(255) UNIQUE NOT NULL,
          quoteDate DATETIME NOT NULL,
          clientId VARCHAR(255) NOT NULL,
          creatorEmail VARCHAR(255) NULL,
          subTotal DECIMAL(12, 2) DEFAULT 0.00,
          vatAmount DECIMAL(12, 2) DEFAULT 0.00,
          grandTotal DECIMAL(12, 2) DEFAULT 0.00,
          currency VARCHAR(10) NOT NULL DEFAULT 'MZN',
          termsAndConditions TEXT NULL,
          notes TEXT NULL,
          status VARCHAR(50) DEFAULT 'Draft',
          approverId VARCHAR(255) NULL,          -- Added for assigned approver
          approvalDate DATETIME NULL,             -- Added for approval timestamp
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (clientId) REFERENCES Client(id) ON DELETE RESTRICT,
          FOREIGN KEY (approverId) REFERENCES Approver(id) ON DELETE SET NULL -- Added FK for approverId
      );
    `;
    await pool.execute(createTableQuery);
    console.log('Quote table created or already exists successfully with approverId and approvalDate.');
  } catch (error) {
    console.error('Error creating Quote table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createQuotesTable();
