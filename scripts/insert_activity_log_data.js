import * as db from '/home/user/studio/backend/db.js'; // Import the entire module

async function insertActivityLogData() {
    try {
        const insertDataQuery = `
            INSERT INTO ActivityLog (id, user, action, timestamp, details) VALUES
            ('log_001', 'Pita Domingos', 'System Admini logged in', '2025-01-26 10:00:00', 'Admin user logged in successfully.'),
            ('log_002', 'Portia Mbuva', 'Created new purchase order', '2025-02-06 10:30:00', 'Created PO #12345.'),
            ('log_003', 'Portia Mbuva', 'Updated purchase order', '2025-02-06 10:45:00', 'Updated PO #12345.'),
            ('log_004', 'Cherinne de Klerk', 'Approved purchase order', '2025-02-06 11:00:00', 'Approved PO #12345.');
        `;
        await db.pool.execute(insertDataQuery); // Access the pool through the imported db module
        console.log('Sample data inserted into ActivityLog table successfully.');
    } catch (error) {
        console.error('Error inserting sample data into ActivityLog table:', error);
    }
}
insertActivityLogData();