module.exports = {

"[project]/.next-internal/server/app/api/purchase-orders/[poId]/items/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[project]/src/app/api/purchase-orders/[poId]/items/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/csv-parser/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/stream [external] (stream, cjs)");
;
;
;
async function GET(request, { params }) {
    const { poId } = params;
    let connection;
    try {
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM POItem WHERE poId = ?', [
            poId
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows);
    } catch (error) {
        console.error(`[API_ERROR] /api/purchase-orders/${poId}/items GET: Error fetching PO items:`, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Failed to fetch PO items for PO ${poId}`,
            details: error.message
        }, {
            status: 500
        });
    } finally{
        if (connection) connection.release();
    }
}
async function POST(request, { params }) {
    const { poId } = params;
    const contentType = request.headers.get('content-type');
    let connection;
    if (!(contentType && contentType.includes('multipart/form-data'))) {
        console.warn(`[API_WARN] /api/purchase-orders/${poId}/items POST: Unsupported Content-Type: ${contentType}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unsupported Content-Type, expected multipart/form-data.'
        }, {
            status: 415
        });
    }
    console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST: Received multipart/form-data request for CSV upload.`);
    try {
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        connection = await pool.getConnection();
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file || typeof file === 'string') {
            console.error(`[API_ERROR] /api/purchase-orders/${poId}/items POST CSV: No file uploaded or file is not a File object.`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No file uploaded or invalid file type'
            }, {
                status: 400
            });
        }
        console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: Received file: ${file.name}, size: ${file.size}, type: ${file.type}`);
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const results = [];
        const stream = __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["Readable"].from(fileBuffer);
        let firstRecordLogged = false;
        console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: Starting CSV parsing...`);
        await new Promise((resolve, reject)=>{
            stream.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
                mapHeaders: ({ header })=>header.trim() // Trim headers
            })).on('headers', (headers)=>{
                console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: Detected CSV Headers:`, headers);
            }).on('data', (data)=>{
                if (!firstRecordLogged) {
                    console.log(`[API_DEBUG] /api/purchase-orders/${poId}/items POST CSV: First parsed data record from CSV:`, data);
                    firstRecordLogged = true;
                }
                results.push(data);
            }).on('end', ()=>{
                console.log(`[API_INFO] /api/purchase-orders/${poId}/items POST CSV: CSV parsing finished. ${results.length} items found.`);
                // TODO: Add logic for validating and inserting PO item data into POItem table,
                // ensuring each item is correctly linked to the poId.
                resolve();
            }).on('error', (parseError)=>{
                console.error(`[API_ERROR] /api/purchase-orders/${poId}/items POST CSV: Error during CSV parsing:`, parseError);
                reject(parseError);
            });
        });
        if (results.length === 0) {
            console.warn(`[API_WARN] /api/purchase-orders/${poId}/items POST CSV: CSV file is empty or could not be parsed into records.`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: `PO Items CSV file for PO ID ${poId} is empty or yielded no records.`
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: `PO Items CSV uploaded and parsed successfully for PO ID ${poId}. ${results.length} items found. (Data not saved to DB yet)`,
            data: results
        });
    } catch (error) {
        console.error(`[API_ERROR] /api/purchase-orders/${poId}/items POST CSV: Error handling PO item file upload:`, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to handle PO item file upload',
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

//# sourceMappingURL=%5Broot-of-the-server%5D__6c12865d._.js.map