
import * as db from '../backend/db.js';

async function createTagsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Tag (
          id VARCHAR(255) PRIMARY KEY,
          tagNumber VARCHAR(255) UNIQUE NOT NULL,
          registration VARCHAR(100) NULL,
          make VARCHAR(100) NULL,
          model VARCHAR(100) NULL,
          tankCapacity INT NULL,
          year INT NULL,
          chassisNo VARCHAR(100) NULL,
          type VARCHAR(100) NULL,
          siteId INT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('Tag (Vehicle/Equipment) table created or already exists successfully.');
  } catch (error) {
    console.error('Error creating Tag table:', error);
  } finally {
    // pool.end();
  }
}

createTagsTable();
