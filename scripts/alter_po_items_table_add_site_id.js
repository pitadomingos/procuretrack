
import { getDbPool } from '../backend/db.js';

async function alterPOItemsTableAddSiteId() {
  let pool;
  try {
    pool = await getDbPool();
    const addColumnQuery = `
      ALTER TABLE POItem
      ADD COLUMN siteId INT;
    `;
    await pool.execute(addColumnQuery);
    console.log('Added siteId column to POItem table.');

    const addForeignKeyQuery = `
      ALTER TABLE POItem
      ADD CONSTRAINT fk_poitem_site
      FOREIGN KEY (siteId) REFERENCES Site(id);
    `;
    await pool.execute(addForeignKeyQuery);
    console.log('Added foreign key constraint on siteId in POItem table.');

    console.log('POItem table altered successfully.');

  } catch (error) {
    console.error('Error altering POItem table:', error);
  } finally {
    if (pool) {
        await pool.end();
        console.log('Database pool ended for script.');
    }
  }
}

alterPOItemsTableAddSiteId();
