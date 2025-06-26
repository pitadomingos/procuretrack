module.exports = {

"[project]/.next-internal/server/app/api/charts/site-po-value-status/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/api/charts/site-po-value-status/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
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
        let poWhereClauses = [
            "po.status IN ('Pending Approval', 'Approved')"
        ];
        const queryParams = [];
        if (month && month !== 'all') {
            poWhereClauses.push("MONTH(po.creationDate) = ?");
            queryParams.push(parseInt(month, 10));
        }
        if (year && year !== 'all') {
            poWhereClauses.push("YEAR(po.creationDate) = ?");
            queryParams.push(parseInt(year, 10));
        }
        const poWhereString = poWhereClauses.length > 0 ? `WHERE ${poWhereClauses.join(' AND ')}` : '';
        const poQuery = `
      SELECT 
        po.id as po_id,
        COALESCE(s.siteCode, s.name, 'Unassigned') as site_identifier,
        po.status,
        po.grandTotal as total_value
      FROM PurchaseOrder po
      LEFT JOIN POItem poi ON po.id = poi.poId 
      LEFT JOIN Site s ON poi.siteId = s.id 
      ${poWhereString}
      GROUP BY po.id, site_identifier, po.status, po.grandTotal 
      ORDER BY site_identifier ASC, po.status ASC;
    `;
        const [poRows] = await connection.execute(poQuery, queryParams);
        const siteData = {};
        const siteOrder = [];
        for (const po of poRows){
            const siteIdentifier = po.site_identifier;
            if (!siteData[siteIdentifier]) {
                siteData[siteIdentifier] = {
                    name: siteIdentifier,
                    'ApprovedValue': 0,
                    'PendingApprovalValue': 0
                };
                if (!siteOrder.includes(siteIdentifier)) {
                    siteOrder.push(siteIdentifier);
                }
            }
            const poValue = Number(po.total_value) || 0;
            const currentStatus = po.status ? po.status.trim() : 'Draft';
            if (currentStatus === 'Pending Approval') {
                siteData[siteIdentifier]['PendingApprovalValue'] = siteData[siteIdentifier]['PendingApprovalValue'] + poValue;
            } else if (currentStatus === 'Approved') {
                siteData[siteIdentifier]['ApprovedValue'] = siteData[siteIdentifier]['ApprovedValue'] + poValue;
            }
        }
        siteOrder.sort();
        const chartData = siteOrder.map((siteIdentifier)=>siteData[siteIdentifier]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(chartData);
    } catch (error) {
        console.error('Error fetching site PO value status data:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch site PO value status data',
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f30facd0._.js.map