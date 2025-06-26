module.exports = {

"[project]/.next-internal/server/app/api/management-stats/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/api/management-stats/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET() {
    let connection;
    try {
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        connection = await pool.getConnection();
        const [suppliersRows] = await connection.execute('SELECT COUNT(*) as count FROM Supplier');
        const suppliersCount = Number(suppliersRows[0]?.count || 0);
        const [approversRows] = await connection.execute('SELECT COUNT(*) as count FROM Approver');
        const approversCount = Number(approversRows[0]?.count || 0);
        const [usersRows] = await connection.execute('SELECT COUNT(*) as count FROM User');
        const usersCount = Number(usersRows[0]?.count || 0);
        const [sitesRows] = await connection.execute('SELECT COUNT(*) as count FROM Site');
        const sitesCount = Number(sitesRows[0]?.count || 0);
        const [categoriesRows] = await connection.execute('SELECT COUNT(*) as count FROM Category');
        const categoriesCount = Number(categoriesRows[0]?.count || 0);
        const [tagsTotalRows] = await connection.execute('SELECT COUNT(*) as count FROM Tag');
        const tagsCount = Number(tagsTotalRows[0]?.count || 0);
        const [tagStatusRows] = await connection.execute('SELECT status, COUNT(*) as count FROM Tag GROUP BY status');
        const tagStatusSummary = {};
        if (Array.isArray(tagStatusRows)) {
            tagStatusRows.forEach((row)=>{
                tagStatusSummary[row.status] = Number(row.count);
            });
        }
        const [clientsRows] = await connection.execute('SELECT COUNT(*) as count FROM Client');
        const clientsCount = Number(clientsRows[0]?.count || 0);
        const responsePayload = {
            suppliersCount,
            approversCount,
            usersCount,
            sitesCount,
            categoriesCount,
            tagsCount,
            tagStatusSummary: tagStatusSummary,
            clientsCount
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responsePayload);
    } catch (error) {
        console.error('[API_ERROR] /api/management-stats GET: Error fetching management entity counts:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch management entity counts from database.',
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f94c1c60._.js.map