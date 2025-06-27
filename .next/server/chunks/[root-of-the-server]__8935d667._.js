module.exports = {

"[project]/.next-internal/server/app/api/dashboard-stats/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/dashboard-stats/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    let connection;
    try {
        // Dynamic import: The database pool is imported only when the API is called.
        const { getDbPool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        const pool = await getDbPool();
        connection = await pool.getConnection();
        let poWhereClause = '';
        let quoteWhereClause = '';
        let fuelWhereClause = '';
        let requisitionWhereClause = '';
        const queryParams = [];
        const quoteQueryParams = [];
        const fuelQueryParams = [];
        const requisitionQueryParams = [];
        if (month && month !== 'all' && year && year !== 'all') {
            poWhereClause = 'WHERE MONTH(creationDate) = ? AND YEAR(creationDate) = ?';
            quoteWhereClause = 'WHERE MONTH(quoteDate) = ? AND YEAR(quoteDate) = ?';
            fuelWhereClause = 'WHERE MONTH(fuelDate) = ? AND YEAR(fuelDate) = ?';
            requisitionWhereClause = 'WHERE MONTH(requisitionDate) = ? AND YEAR(requisitionDate) = ?';
            queryParams.push(parseInt(month, 10), parseInt(year, 10));
            quoteQueryParams.push(parseInt(month, 10), parseInt(year, 10));
            fuelQueryParams.push(parseInt(month, 10), parseInt(year, 10));
            requisitionQueryParams.push(parseInt(month, 10), parseInt(year, 10));
        } else if (year && year !== 'all') {
            poWhereClause = 'WHERE YEAR(creationDate) = ?';
            quoteWhereClause = 'WHERE YEAR(quoteDate) = ?';
            fuelWhereClause = 'WHERE YEAR(fuelDate) = ?';
            requisitionWhereClause = 'WHERE YEAR(requisitionDate) = ?';
            queryParams.push(parseInt(year, 10));
            quoteQueryParams.push(parseInt(year, 10));
            fuelQueryParams.push(parseInt(year, 10));
            requisitionQueryParams.push(parseInt(year, 10));
        }
        // Users Stats (not time-filtered for now)
        const [userRows] = await connection.execute('SELECT isActive, COUNT(*) as count FROM User GROUP BY isActive');
        let totalUsers = 0;
        let activeUsers = 0;
        let inactiveUsers = 0;
        userRows.forEach((row)=>{
            const count = Number(row.count);
            totalUsers += count;
            if (row.isActive) activeUsers = count;
            else inactiveUsers = count;
        });
        // Purchase Order Stats
        const [poRows] = await connection.execute(`SELECT status, COUNT(*) as count FROM PurchaseOrder ${poWhereClause} GROUP BY status`, queryParams);
        let totalPOs = 0;
        let approvedPOs = 0;
        let pendingPOs = 0;
        let rejectedPOs = 0;
        poRows.forEach((row)=>{
            const count = Number(row.count);
            totalPOs += count;
            if (row.status === 'Approved') approvedPOs = count;
            else if (row.status === 'Pending Approval') pendingPOs = count;
            else if (row.status === 'Rejected') rejectedPOs = count;
        });
        // Goods Received
        const grnActivityBaseQuery = `
       FROM PurchaseOrder po
       JOIN POItem poi ON po.id = poi.poId
       WHERE poi.quantityReceived > 0 
    `;
        let grnActivityWhereClause = '';
        const grnActivityParams = [];
        if (month && month !== 'all' && year && year !== 'all') {
            grnActivityWhereClause = 'AND MONTH(po.creationDate) = ? AND YEAR(po.creationDate) = ?';
            grnActivityParams.push(parseInt(month, 10), parseInt(year, 10));
        } else if (year && year !== 'all') {
            grnActivityWhereClause = 'AND YEAR(po.creationDate) = ?';
            grnActivityParams.push(parseInt(year, 10));
        }
        const [grnPOsRows] = await connection.execute(`SELECT COUNT(DISTINCT po.id) as count ${grnActivityBaseQuery} ${grnActivityWhereClause}`, grnActivityParams);
        const totalPOsWithGRNActivity = Number(grnPOsRows[0]?.count || 0);
        // Approved POs for GRN stat (this count might also be filtered by date)
        const [approvedPORowsForGRN] = await connection.execute(`SELECT COUNT(*) as count FROM PurchaseOrder WHERE status = 'Approved' ${poWhereClause ? `AND ${poWhereClause.substring(6)}` : ''}`, queryParams);
        const totalApprovedPOsForGRN = Number(approvedPORowsForGRN[0]?.count || 0);
        // Requisition Stats
        const [requisitionRows] = await connection.execute(`SELECT COUNT(*) as count FROM Requisition ${requisitionWhereClause}`, requisitionQueryParams);
        const totalRequisitions = Number(requisitionRows[0]?.count || 0);
        // Fuel Records Stats
        const [fuelRecordsRows] = await connection.execute(`SELECT COUNT(*) as count FROM FuelRecord ${fuelWhereClause}`, fuelQueryParams);
        const totalFuelRecords = Number(fuelRecordsRows[0]?.count || 0);
        const [fuelTagsRows] = await connection.execute('SELECT COUNT(DISTINCT id) as count FROM Tag');
        const totalFuelTags = Number(fuelTagsRows[0]?.count || 0);
        // Client Quotes Stats
        const [quoteRows] = await connection.execute(`SELECT status, COUNT(*) as count FROM Quote ${quoteWhereClause} GROUP BY status`, quoteQueryParams);
        let totalQuotes = 0;
        let approvedQuotes = 0;
        let pendingQuotes = 0;
        let rejectedQuotes = 0;
        quoteRows.forEach((row)=>{
            const count = Number(row.count);
            totalQuotes += count;
            if (row.status === 'Approved') approvedQuotes = count;
            else if (row.status === 'Pending Approval') pendingQuotes = count;
            else if (row.status === 'Rejected') rejectedQuotes = count;
        });
        const responsePayload = {
            users: {
                total: totalUsers,
                active: activeUsers,
                inactive: inactiveUsers
            },
            purchaseOrders: {
                total: totalPOs,
                approved: approvedPOs,
                pending: pendingPOs,
                rejected: rejectedPOs
            },
            goodsReceived: {
                totalApprovedPOs: totalApprovedPOsForGRN,
                totalPOsWithGRNActivity: totalPOsWithGRNActivity
            },
            requisitions: {
                total: totalRequisitions
            },
            fuel: {
                totalTags: totalFuelTags,
                totalRecords: totalFuelRecords
            },
            clientQuotes: {
                total: totalQuotes,
                approved: approvedQuotes,
                pending: pendingQuotes,
                rejected: rejectedQuotes
            }
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responsePayload);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch dashboard statistics',
            details: error.message
        }, {
            status: 500
        });
    } finally{
        if (connection) connection.release();
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__8935d667._.js.map