
import * as db from '../backend/db.js';

async function alterRequisitionItemsTableAddSiteId() {
  let connection;
  try {
    connection = await db.pool.getConnection();
    const dbName = connection.config.database;

    // Check if siteId column exists
    const [columnCheckRows] = await connection.execute(`
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'RequisitionItem'
      AND COLUMN_NAME = 'siteId';
    `, [dbName]);

    if (columnCheckRows[0].count === 0) {
      console.log("Column 'siteId' not found in RequisitionItem table. Attempting to add it...");
      const addColumnQuery = `
        ALTER TABLE RequisitionItem
        ADD COLUMN siteId INT NULL AFTER categoryId;
      `;
      await connection.execute(addColumnQuery);
      console.log("Successfully added 'siteId' column (INT NULL) to RequisitionItem table.");

      console.log("Attempting to add foreign key constraint 'fk_reqitem_site'...");
      const addForeignKeyQuery = `
        ALTER TABLE RequisitionItem
        ADD CONSTRAINT fk_reqitem_site
        FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL;
      `;
      await connection.execute(addForeignKeyQuery);
      console.log("Successfully added foreign key 'fk_reqitem_site' to RequisitionItem table.");
    } else {
      console.log("Column 'siteId' already exists in RequisitionItem table.");
      // Optionally, check if FK exists and add if not
      const [fkCheckRows] = await connection.execute(`
        SELECT COUNT(*) AS count
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'RequisitionItem'
        AND CONSTRAINT_NAME = 'fk_reqitem_site'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY';
      `, [dbName]);

      if (fkCheckRows[0].count === 0) {
        console.log("Foreign key 'fk_reqitem_site' not found. Attempting to add it...");
        const addForeignKeyQuery = `
          ALTER TABLE RequisitionItem
          ADD CONSTRAINT fk_reqitem_site
          FOREIGN KEY (siteId) REFERENCES Site(id) ON DELETE SET NULL;
        `;
        await connection.execute(addForeignKeyQuery);
        console.log("Successfully added foreign key 'fk_reqitem_site' to RequisitionItem table.");
      } else {
        console.log("Foreign key 'fk_reqitem_site' already exists.");
      }
    }

    console.log("RequisitionItem table alteration script for siteId completed successfully.");

  } catch (error) {
    console.error("Error altering RequisitionItem table for siteId:", error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
    // await db.pool.end(); // Consider if it's a standalone script
  }
}

alterRequisitionItemsTableAddSiteId();
