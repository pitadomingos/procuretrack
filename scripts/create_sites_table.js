
import { getDbPool } from '../backend/db.js';

async function createSiteTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE Site (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          siteCode VARCHAR(255)
      );
    `;
    await pool.execute(createTableQuery);
    console.log('Site table created successfully.');
  } catch (error) {
    console.error('Error creating Site table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createSiteTable();
