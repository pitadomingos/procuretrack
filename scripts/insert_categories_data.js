
import { getDbPool } from '../backend/db.js';

async function insertCategoriesData() {
  let pool;
  try {
    pool = await getDbPool();
    const categories = [
      'Safet Consumables',
      'Fleet Maintenance',
      'Tools and Accessories',
      'Stationery',
      'Building Maitenance',
      'Uniforms',
      'Advertising/Marketing',
      'Gvt Taxes',
      'Communication',
      'Furniture',
      'Workshop Consumables',
      'Third-party Services',
      'IT Equipment',
      'IT Consumables',
      'Others (Specify)',
    ];

    const insertDataQuery = `
      INSERT INTO Category (category) VALUES ?
    `;

    const values = categories.map(category => [category]);

    await pool.query(insertDataQuery, [values]);

    console.log('Sample data inserted into Category table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into Category table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

insertCategoriesData();
