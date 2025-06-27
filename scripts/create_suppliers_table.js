
import { getDbPool } from '../backend/db.js';

async function createSuppliersTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE Supplier (
          supplierCode VARCHAR(255) PRIMARY KEY,
          supplierName VARCHAR(255) NOT NULL,
          salesPerson VARCHAR(255),
          cellNumber VARCHAR(255),
          physicalAddress TEXT,
          nuitNumber VARCHAR(255),
          emailAddress VARCHAR(255)
      );
    `;
    await pool.execute(createTableQuery);
    console.log('Supplier table created successfully.');
  } catch (error) {
    console.error('Error creating Supplier table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createSuppliersTable();
