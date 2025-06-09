import * as db from '../backend/db.js';

async function dropSiteTable() {
  try {
    const dropTableQuery = `
      DROP TABLE IF EXISTS Site;
    `;
    await db.pool.execute(dropTableQuery);
    console.log('Site table dropped successfully (if it existed).');
  } catch (error) {
    console.error('Error dropping Site table:', error);
  }
}

dropSiteTable();