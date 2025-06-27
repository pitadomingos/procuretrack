
import { getDbPool } from '../backend/db.js';

async function dropSiteTable() {
  let pool;
  try {
    pool = await getDbPool();
    const dropTableQuery = `
      DROP TABLE IF EXISTS Site;
    `;
    await pool.execute(dropTableQuery);
    console.log('Site table dropped successfully (if it existed).');
  } catch (error) {
    console.error('Error dropping Site table:', error);
  } finally {
     if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

dropSiteTable();
