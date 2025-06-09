import * as db from '../backend/db.js';

async function createSuppliersTable() {
  try {
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
    await db.pool.execute(createTableQuery);
    console.log('Supplier table created successfully.');
  } catch (error) {
    console.error('Error creating Supplier table:', error);
  } finally {
    // It's generally better to keep the pool open for the application lifetime,
    // but for a simple script, you might close it if it's the only script running.
    // db.pool.end();
  }
}

createSuppliersTable();