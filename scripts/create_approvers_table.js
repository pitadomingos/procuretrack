import * as db from '../backend/db.js';

async function createApproverTable() {
  try {
    const createTableQuery = `
      CREATE TABLE Approver (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          department VARCHAR(255),
          isActive BOOLEAN,
          approvalLimit DECIMAL(10, 2)
      );
    `;
    await db.pool.execute(createTableQuery);
    console.log('Approver table created successfully.');
  } catch (error) {
    console.error('Error creating Approver table:', error);
  } finally {
    // pool.end();
  }
}

createApproverTable();
