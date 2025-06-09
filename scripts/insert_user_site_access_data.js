import * as db from '../backend/db.js';

async function insertUserSiteAccessData() {
  try {
    const userDataWithSiteCodes = [
      { userId: 'user_001', siteCodes: ['TMW', 'TML', 'MEM', 'FMS', 'CHW'] },
      { userId: 'user_002', siteCodes: ['TMW', 'TML', 'MEM', 'FMS', 'CHW'] },
      { userId: 'user_003', siteCodes: ['TMW', 'TML', 'MEM', 'FMS', 'CHW'] },
      { userId: 'user_004', siteCodes: ['TMW', 'TML', 'MEM', 'FMS', 'CHW'] },
      { userId: 'user_005', siteCodes: ['TMW', 'TML', 'MEM', 'FMS', 'CHW'] },
    ];

    // Fetch site IDs based on site codes one by one
    const siteCodeToIdMap = {};
    for (const user of userDataWithSiteCodes) {
      for (const siteCode of user.siteCodes) {
        if (!siteCodeToIdMap[siteCode]) { // Fetch only if not already fetched
          const [siteRows] = await db.pool.execute(
            `SELECT id FROM Site WHERE siteCode = ?`,
            [siteCode]
          );
          if (siteRows.length > 0) {
            siteCodeToIdMap[siteCode] = siteRows[0].id;
          } else {
            console.warn(`Site code "${siteCode}" not found in Site table.`);
          }
        }
      }
    }

    // Prepare data for insertion into UserSiteAccess
    const userSiteAccessData = [];
    userDataWithSiteCodes.forEach(user => {
      user.siteCodes.forEach(siteCode => {
        const siteId = siteCodeToIdMap[siteCode];
        if (siteId) {
          userSiteAccessData.push([user.userId, siteId]);
        }
      });
    });

    if (userSiteAccessData.length > 0) {
      // Insert data into UserSiteAccess table
      const insertQuery = `
        INSERT INTO UserSiteAccess (userId, siteId) VALUES ?
      `;
      await db.pool.query(insertQuery, [userSiteAccessData]);
      console.log('Sample data inserted into UserSiteAccess table successfully.');
    } else {
      console.log('No valid user-site access data to insert.');
    }

  } catch (error) {
    console.error('Error inserting sample data into UserSiteAccess table:', error);
  } finally {
    // pool.end(); // Consider if you want to close the pool here
  }
}

insertUserSiteAccessData();
