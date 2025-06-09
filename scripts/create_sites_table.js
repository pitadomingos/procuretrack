import * as db from '../backend/db.js';

async function createSiteTable() {
  try {
    const createTableQuery = `
      CREATE TABLE Site (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          siteCode VARCHAR(255)
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('Site table created successfully.');
  } catch (error) {
    console.error('Error creating Site table:', error);
  } finally {
    // pool.end();
  }
}

createSiteTable();
