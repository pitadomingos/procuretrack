
import { getDbPool } from '../backend/db.js';

async function createQuoteItemsTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS QuoteItem (
          id VARCHAR(255) PRIMARY KEY,
          quoteId VARCHAR(255) NOT NULL,
          partNumber VARCHAR(255) NULL,
          customerRef VARCHAR(255) NULL,
          description TEXT NOT NULL,
          quantity INT NOT NULL,
          unitPrice DECIMAL(12, 2) NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (quoteId) REFERENCES Quote(id) ON DELETE CASCADE
      );
    `;
    await pool.execute(createTableQuery);
    console.log('QuoteItem table created or already exists successfully.');
  } catch (error) {
    console.error('Error creating QuoteItem table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createQuoteItemsTable();
