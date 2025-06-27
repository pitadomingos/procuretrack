
import { getDbPool } from '../backend/db.js';

async function insertUserData() {
  let pool;
  try {
    pool = await getDbPool();
    const insertDataQuery = `
      INSERT INTO User (id, name, email, role, isActive, password) VALUES
      ('user_001', 'Pita Domingos', 'pita.domingos@jachris.com', 'Admin', TRUE, 'admin'),
      ('user_002', 'Portia Mbuva', 'portia.mbuva@jachris.com', 'Creator', TRUE, 'password123'),
      ('user_003', 'Cherinne de Klerk', 'cherinne.deklerk@jachris.com', 'Approver', TRUE, 'password123'),
      ('user_004', 'Cobus de Klerk', 'cobus.klerk@jachris.com', 'Approver', TRUE, 'password123'),
      ('user_005', 'Gil Lunguze', 'gil.lunguze@jachris.com', 'Creator', TRUE, 'password123');
    `;
    await pool.execute(insertDataQuery);
    console.log('Sample data inserted into User table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into User table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

insertUserData();
