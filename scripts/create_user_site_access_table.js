import * as db from '../backend/db.js';

async function createUserSiteAccessTable() {
  try {
    const createTableQuery = `
      CREATE TABLE UserSiteAccess (
          userId VARCHAR(255),
          siteId INT,
          PRIMARY KEY (userId, siteId),
          FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE CASCADE
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('UserSiteAccess table created successfully.');
  } catch (error) {
    console.error('Error creating UserSiteAccess table:', error);
  } finally {
    // pool.end();
  }
}

createUserSiteAccessTable();