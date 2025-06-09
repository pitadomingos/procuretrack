import * as db from '../backend/db.js';

async function createPOItemTable() {
  try {
    const createTableQuery = `
      CREATE TABLE POItem (
          id INT AUTO_INCREMENT PRIMARY KEY,
          poId INT,
          partNumber VARCHAR(255),
          description TEXT NOT NULL,
          categoryId INT,
          uom VARCHAR(50),
          quantity INT NOT NULL,
          unitPrice DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (poId) REFERENCES PurchaseOrder(id) ON DELETE CASCADE,
          FOREIGN KEY (categoryId) REFERENCES Category(id)
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('POItem table created successfully.');
  } catch (error) {
    console.error('Error creating POItem table:', error);
  } finally {
    // pool.end();
  }
}

createPOItemTable();