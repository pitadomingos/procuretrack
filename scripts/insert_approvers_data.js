
import { getDbPool } from '../backend/db.js';

async function insertApproversData() {
  let pool;
  try {
    pool = await getDbPool();
    const insertDataQuery = `
      INSERT INTO Approver (id, name, email, department, isActive, approvalLimit) VALUES
      ('approver_001', 'Cherinne de Klerk', 'cherinne.deklerk@jachris.com', 'All', TRUE, 50000.00),
      ('approver_002', 'Cobus de Klerk', 'cobus.deklerk@jachris.com', 'All', TRUE, 50000.00),
      ('approver_003', 'Pita Domingos', 'pita.domingos@jachris.com', 'All', TRUE, 5000.00);
    `;
    await pool.execute(insertDataQuery);
    console.log('Sample data inserted into Approver table successfully.');
  } catch (error) {
    console.error('Error inserting sample data into Approver table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

insertApproversData();
