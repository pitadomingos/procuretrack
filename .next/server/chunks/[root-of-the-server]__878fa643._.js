module.exports = {

"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/process [external] (process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/timers [external] (timers, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/string_decoder [external] (string_decoder, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[project]/backend/db.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getDbPool": (()=>getDbPool)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
let pool = null;
async function getDbPool() {
    if (pool) {
        return pool;
    }
    // --- Debugging Environment ---
    console.log('[DB_INIT] Current working directory:', process.cwd());
    console.log('[DB_INIT] Checking for environment variables...');
    try {
        // Check for essential DB environment variables
        const essentialEnvVars = [
            'DB_HOST',
            'DB_USER',
            'DB_PASSWORD',
            'DB_NAME'
        ];
        const missingEnvVars = [];
        for (const v of essentialEnvVars){
            if (!process.env[v]) {
                missingEnvVars.push(v);
            } else {
                // Avoid logging password in production
                if (v !== 'DB_PASSWORD') {
                    console.log(`[DB_INIT] Found ENV VAR: ${v} = ${process.env[v]}`);
                } else {
                    console.log(`[DB_INIT] Found ENV VAR: DB_PASSWORD = (hidden)`);
                }
            }
        }
        if (missingEnvVars.length > 0) {
            const errorMsg = `Database configuration is incomplete. Missing variables: ${missingEnvVars.join(', ')}. Please define these in your root .env file.`;
            console.error(`[DB_INIT_ERROR] ${errorMsg}`);
            throw new Error(errorMsg);
        }
        // --- SSL Certificate Handling ---
        const caCertPathOrContent = process.env.DB_SSL_CA;
        let caCertContent;
        if (caCertPathOrContent) {
            const potentialPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), caCertPathOrContent);
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(potentialPath) && __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].statSync(potentialPath).isFile()) {
                console.log(`DB_INIT_INFO: DB_SSL_CA points to a file. Reading certificate from "${potentialPath}".`);
                caCertContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(potentialPath, 'utf8');
            } else {
                console.log("DB_INIT_INFO: DB_SSL_CA does not appear to be a file path. Using its content directly for SSL connection.");
                caCertContent = caCertPathOrContent;
            }
        } else {
            console.warn(`DB_WARN: The DB_SSL_CA environment variable is not set. Connecting with SSL using system default CAs. If connection fails, please provide the path to your 'ca.pem' file in the DB_SSL_CA variable in your .env file.`);
        }
        const sslConfig = {
            rejectUnauthorized: true,
            ca: caCertContent || undefined
        };
        // --- Connection Pool Creation ---
        console.log("DB_INIT_INFO: Creating database connection pool for the first time.");
        const newPool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
            ssl: sslConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        try {
            // Test the connection before assigning it to the singleton
            const connection = await newPool.getConnection();
            console.log("DB_INIT_SUCCESS: Database connection pool created and verified successfully.");
            connection.release();
        } catch (testError) {
            console.error("CRITICAL_DB_INIT_ERROR: Failed to get a connection from the pool after creation.", testError);
            // Destroy the pool if the initial connection test fails
            newPool.end();
            throw testError; // Re-throw to be caught by the main catch block
        }
        pool = newPool;
        return pool;
    } catch (error) {
        console.error(`CRITICAL_DB_INIT_ERROR: Failed to create and verify database connection pool. Error: ${error.message}`);
        // Re-throw the error to be caught by the calling API route
        throw error;
    }
}
;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__878fa643._.js.map