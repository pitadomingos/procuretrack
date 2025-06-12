import * as db from '../backend/db.js';

async function alterPOItemsTableAddSiteId() {
  try {
    const addColumnQuery = `
      ALTER TABLE POItem
      ADD COLUMN siteId INT;
    `;
    await db.pool.execute(addColumnQuery);
    console.log('Added siteId column to POItem table.');

    const addForeignKeyQuery = `
      ALTER TABLE POItem
      ADD CONSTRAINT fk_poitem_site
      FOREIGN KEY (siteId) REFERENCES Site(id);
    `;
    await db.pool.execute(addForeignKeyQuery);
    console.log('Added foreign key constraint on siteId in POItem table.');

    console.log('POItem table altered successfully.');

  } catch (error) {
    console.error('Error altering POItem table:', error);
  } finally {
    // Consider if you want to close the pool here
    // db.pool.end();
  }
}

alterPOItemsTableAddSiteId();