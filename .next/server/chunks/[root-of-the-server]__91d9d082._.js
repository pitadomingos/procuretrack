module.exports = {

"[project]/.next-internal/server/app/api/activity-log/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/api/activity-log/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
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
    const limitParam = searchParams.get('limit');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const userFilter = searchParams.get('userFilter');
    const actionTypeFilter = searchParams.get('actionTypeFilter');
    let limit = 100;
    if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
            limit = parsedLimit;
        }
    }
    console.log(`[API_INFO] /api/activity-log GET: Received params - limit: ${limit}, month: ${month}, year: ${year}, userFilter: ${userFilter}, actionTypeFilter: ${actionTypeFilter}`);
    let connection;
    try {
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        connection = await pool.getConnection();
        console.log(`[API_INFO] /api/activity-log GET: Database connection obtained.`);
        let query = `
      SELECT id, user, action, timestamp, details
      FROM ActivityLog
    `;
        const whereClauses = [];
        const queryParams = [];
        if (month && month !== 'all') {
            const parsedMonth = parseInt(month, 10);
            if (!isNaN(parsedMonth)) {
                whereClauses.push("MONTH(timestamp) = ?");
                queryParams.push(parsedMonth);
            } else {
                console.warn(`[API_WARN] /api/activity-log GET: Invalid month value received: ${month}. Ignoring month filter.`);
            }
        }
        if (year && year !== 'all') {
            const parsedYear = parseInt(year, 10);
            if (!isNaN(parsedYear)) {
                whereClauses.push("YEAR(timestamp) = ?");
                queryParams.push(parsedYear);
            } else {
                console.warn(`[API_WARN] /api/activity-log GET: Invalid year value received: ${year}. Ignoring year filter.`);
            }
        }
        if (userFilter && userFilter.trim() !== '') {
            whereClauses.push("user LIKE ?");
            queryParams.push(`%${userFilter.trim()}%`);
        }
        if (actionTypeFilter && actionTypeFilter.trim() !== '') {
            whereClauses.push("action LIKE ?");
            queryParams.push(`%${actionTypeFilter.trim()}%`);
        }
        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        query += ` ORDER BY timestamp DESC LIMIT ?`;
        queryParams.push(limit);
        console.log(`[API_INFO] /api/activity-log GET: Executing query: ${query.replace(/\s+/g, ' ').trim()} with params: ${JSON.stringify(queryParams)}`);
        const [rows] = await connection.query(query, queryParams);
        console.log(`[API_INFO] /api/activity-log GET: Successfully fetched ${rows.length} activity log entries.`);
        const activityLog = rows.map((row)=>({
                ...row,
                timestamp: new Date(row.timestamp).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(activityLog);
    } catch (error) {
        console.error('[API_ERROR] /api/activity-log GET: Error fetching activity log:', error);
        const errorCode = error.code || 'N/A';
        const sqlMessage = error.sqlMessage || error.message;
        const details = `Error Code: ${errorCode}. Message: ${sqlMessage}. SQL State: ${error.sqlState || 'N/A'}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch activity log data from the database.',
            details: details,
            rawErrorMessage: error.message
        }, {
            status: 500
        });
    } finally{
        if (connection) {
            try {
                await connection.release();
                console.log('[API_INFO] /api/activity-log GET: Database connection released.');
            } catch (releaseError) {
                console.error('[API_ERROR] /api/activity-log GET: Error releasing DB connection:', releaseError.message);
            }
        }
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__91d9d082._.js.map