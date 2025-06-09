import * as db from '../backend/db.js';

async function insertUserData() {
  try {
    const insertDataQuery = `
      INSERT INTO User (id, name, email, role, isActive) VALUES
      ('user_001', 'Pita Domingos', 'pita.domingos@jachris.com', 'Admin', TRUE),
      ('user_002', 'Portia Mbuva', 'portia.mbuva@jachris.com', 'Creator', TRUE),
      ('user_003', 'Cherinne de Klerk', 'cherinne.deklerk@jachris.com', 'Approver', TRUE),
      ('user_004', 'Cobus de Klerk', 'cobus.klerk@jachris.com', 'Approver', TRUE),
      ('user_005', 'Gil Lunguze', 'gil.lunguze@jachris.com', 'Creator', TRUE);
    `;
    await db.pool.execute(insertDataQuery);
    console.log('Sample data inserted into User table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into User table:', error);
  } finally {
    // pool.end();
  }
}

insertUserData();