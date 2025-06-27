
import { getDbPool } from '../backend/db.js';

async function insertSiteData() {
  let pool;
  try {
    pool = await getDbPool();
    const insertDataQuery = `
      INSERT INTO Site (name, location, siteCode) VALUES
      ('Tete Main Warehouse', 'Moatize', 'TMW'),
      ('Tete Main Lubrication', 'Moatize', 'TML'),
      ('Mote-Engil Mozambique', 'Moatize', 'MEM'),
      ('Fuel Management System', 'Moatize', 'FMS'),
      ('C. Hose Warehouse', 'Moatize', 'CHW');
    `;
    await pool.execute(insertDataQuery);
    console.log('Sample data inserted into Site table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into Site table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

insertSiteData();
