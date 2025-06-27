
import { getDbPool } from '../backend/db.js';

async function createFuelRecordsTable() {
  let pool;
  try {
    pool = await getDbPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS FuelRecord (
          id VARCHAR(255) PRIMARY KEY,
          fuelDate DATETIME NOT NULL,
          reqNo VARCHAR(100) NULL,
          invNo VARCHAR(100) NULL,
          driver VARCHAR(255) NULL,
          odometer INT NULL,
          tagId VARCHAR(255) NOT NULL,
          siteId INT NULL,
          description VARCHAR(255) NULL,
          uom VARCHAR(50) NULL,
          quantity DECIMAL(10, 2) NOT NULL,
          unitCost DECIMAL(10, 2) NOT NULL,
          recorderUserId VARCHAR(255) NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE RESTRICT,
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL,
          FOREIGN KEY (recorderUserId) REFERENCES User(id) ON DELETE SET NULL
      );
    `;
    await pool.execute(createTableQuery);
    console.log('FuelRecord table created or already exists successfully.');
  } catch (error) {
    console.error('Error creating FuelRecord table:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database pool ended for script.');
    }
  }
}

createFuelRecordsTable();
