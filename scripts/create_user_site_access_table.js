
import { getDbPool } from '../backend/db.js';

async function createUserSiteAccessTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE UserSiteAccess (
          userId VARCHAR(255),
          siteId INT,
          PRIMARY KEY (userId, siteId),
          FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE CASCADE
      );
    `;
    await pool.execute(createTableQuery);
    console.log('UserSiteAccess table created successfully.');
  } catch (error) {
    console.error('Error creating UserSiteAccess table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createUserSiteAccessTable();
