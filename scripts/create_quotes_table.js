
import * as db from '../backend/db.js';

async function createQuotesTable() {
  try {
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
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (clientId) REFERENCES Client(id) ON DELETE RESTRICT
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('Quote table created or already exists successfully.');
  } catch (error) {
    console.error('Error creating Quote table:', error);
  } finally {
    // pool.end();
  }
}

createQuotesTable();
