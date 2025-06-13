
import * as db from '../backend/db.js';

async function alterPurchaseOrdersTableHandleApprovedByUserId() {
  console.log("Information: The 'approvedByUserId' column (linking to User.id for who performed approval action) is no longer part of the target PurchaseOrder schema as per recent design changes.");
  console.log("This script originally intended to add this column. It will now check if it exists and suggest removal if found, or confirm it's absent.");

  let connection;
  try {
    connection = await db.pool.getConnection();
    const dbName = connection.config.database;

    const checkColumnQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'PurchaseOrder'
      AND COLUMN_NAME = 'approvedByUserId';
    `;
    const [rows] = await connection.execute(checkColumnQuery, [dbName]);

    if (rows[0].count > 0) {
      console.warn("WARNING: The column 'approvedByUserId' still exists in the PurchaseOrder table.");
      console.warn("As per the current design, this column is obsolete and should ideally be removed.");
      console.warn("Consider using a separate SQL command to drop it if it's no longer needed: ALTER TABLE PurchaseOrder DROP COLUMN approvedByUserId; (after ensuring any FK constraints are dropped first).");
    } else {
      console.log("Confirmed: The 'approvedByUserId' column does not exist in PurchaseOrder table, which aligns with the current schema design.");
    }

  } catch (error) {
    console.error("Error during check for 'approvedByUserId' column:", error);
  } finally {
    if (connection) connection.release();
    // await db.pool.end(); // Optional: end pool if script is standalone
  }
}

alterPurchaseOrdersTableHandleApprovedByUserId();
