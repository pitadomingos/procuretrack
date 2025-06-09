import * as db from '../backend/db.js';

async function insertSiteData() {
  try {
    const insertDataQuery = `
      INSERT INTO Site (name, location, siteCode) VALUES
      ('Tete Main Warehouse', 'Moatize', 'TMW'),
      ('Tete Main Lubrication', 'Moatize', 'TML'),
      ('Mote-Engil Mozambique', 'Moatize', 'MEM'),
      ('Fuel Management System', 'Moatize', 'FMS'),
      ('C. Hose Warehouse', 'Moatize', 'CHW');
    `;
    await db.pool.execute(insertDataQuery);
    console.log('Sample data inserted into Site table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into Site table:', error);
  } finally {
    // Close the pool if this is the only script running
    // db.pool.end();
  }
}

insertSiteData();