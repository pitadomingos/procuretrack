module.exports = {

"[project]/.next-internal/server/app/api/purchase-orders/[poId]/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/api/purchase-orders/[poId]/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request, { params }) {
    const { poId } = params;
    let connection;
    try {
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        connection = await pool.getConnection();
        // Selecting all columns, including siteId from PurchaseOrder table
        const [rows] = await connection.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [
            poId
        ]);
        if (rows.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows[0]);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: `Purchase order with ID ${poId} not found`
            }, {
                status: 404
            });
        }
    } catch (error) {
        console.error(`Error fetching purchase order with ID ${poId}:`, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Failed to fetch purchase order with ID ${poId}`
        }, {
            status: 500
        });
    } finally{
        if (connection) connection.release();
    }
}
async function PUT(request, { params }) {
    const { poId } = params;
    const numericPoId = Number(poId);
    if (isNaN(numericPoId)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid Purchase Order ID'
        }, {
            status: 400
        });
    }
    let connection;
    try {
        const { pool } = await __turbopack_context__.r("[project]/backend/db.js [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
        const poData = await request.json();
        const { poNumber, creationDate, requestedByName, supplierId, approverId, siteId, subTotal, vatAmount, grandTotal, currency, pricesIncludeVat, notes, items } = poData;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const finalSiteId = siteId ? Number(siteId) : null; // Ensure siteId is number or null
        const [poUpdateResult] = await connection.execute(`UPDATE PurchaseOrder SET 
        poNumber = ?, creationDate = ?, requestedByName = ?, supplierId = ?, approverId = ?, siteId = ?,
        subTotal = ?, vatAmount = ?, grandTotal = ?, currency = ?, pricesIncludeVat = ?, notes = ?
       WHERE id = ?`, [
            poNumber,
            new Date(creationDate),
            requestedByName,
            supplierId,
            approverId,
            finalSiteId,
            subTotal,
            vatAmount,
            grandTotal,
            currency,
            pricesIncludeVat,
            notes,
            numericPoId
        ]);
        if (poUpdateResult.affectedRows === 0) {
            await connection.rollback();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Purchase Order with ID ${numericPoId} not found for update.`
            }, {
                status: 404
            });
        }
        await connection.execute('DELETE FROM POItem WHERE poId = ?', [
            numericPoId
        ]);
        if (items && items.length > 0) {
            for (const item of items){
                await connection.execute(`INSERT INTO POItem (poId, partNumber, description, categoryId, siteId, uom, quantity, unitPrice, quantityReceived, itemStatus)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    numericPoId,
                    item.partNumber || null,
                    item.description,
                    item.categoryId ? Number(item.categoryId) : null,
                    item.siteId ? Number(item.siteId) : null,
                    item.uom,
                    Number(item.quantity),
                    Number(item.unitPrice),
                    item.quantityReceived || 0,
                    item.itemStatus || 'Pending'
                ]);
            }
        }
        await connection.commit();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Purchase order updated successfully',
            poId: numericPoId,
            poNumber: poNumber
        });
    } catch (dbError) {
        if (connection) {
            await connection.rollback();
        }
        console.error(`Error updating purchase order ${numericPoId}:`, dbError);
        const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update purchase order.',
            details: errorMessage
        }, {
            status: 500
        });
    } finally{
        if (connection) {
            connection.release();
        }
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__2b7e23ba._.js.map