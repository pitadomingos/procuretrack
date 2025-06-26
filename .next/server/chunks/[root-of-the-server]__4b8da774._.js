module.exports = {

"[project]/.next-internal/server/app/api/charts/monthly-po-status/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/api/charts/monthly-po-status/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
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
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        connection = await pool.getConnection();
        let whereClauses = [];
        const queryParams = [];
        if (month && month !== 'all') {
            whereClauses.push("MONTH(creationDate) = ?");
            queryParams.push(parseInt(month, 10));
        }
        if (year && year !== 'all') {
            whereClauses.push("YEAR(creationDate) = ?");
            queryParams.push(parseInt(year, 10));
        }
        whereClauses.push("status IN ('Pending Approval', 'Approved')");
        const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const query = `
      SELECT 
        DATE_FORMAT(creationDate, '%Y-%m') as month_year,
        status,
        COUNT(*) as count
      FROM PurchaseOrder
      ${whereString}
      GROUP BY month_year, status
      ORDER BY month_year ASC, status ASC;
    `;
        const [rows] = await connection.execute(query, queryParams);
        const monthlyData = {};
        const monthOrder = [];
        rows.forEach((row)=>{
            const monthYear = row.month_year;
            if (!monthlyData[monthYear]) {
                const [y, mNum] = monthYear.split('-');
                const date = new Date(Number(y), Number(mNum) - 1);
                const displayMonth = date.toLocaleString('default', {
                    month: 'short'
                });
                monthlyData[monthYear] = {
                    name: `${displayMonth} ${y}`,
                    'Approved': 0,
                    'Pending Approval': 0
                };
                if (!monthOrder.includes(monthYear)) {
                    monthOrder.push(monthYear);
                }
            }
            const count = Number(row.count);
            if (row.status === 'Approved') {
                monthlyData[monthYear]['Approved'] = monthlyData[monthYear]['Approved'] + count;
            } else if (row.status === 'Pending Approval') {
                monthlyData[monthYear]['Pending Approval'] = monthlyData[monthYear]['Pending Approval'] + count;
            }
        });
        monthOrder.sort((a, b)=>new Date(a).getTime() - new Date(b).getTime());
        const chartData = monthOrder.map((monthYear)=>monthlyData[monthYear]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(chartData);
    } catch (error) {
        console.error('Error fetching monthly PO status data:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch monthly PO status data',
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4b8da774._.js.map