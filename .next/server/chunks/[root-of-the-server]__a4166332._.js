module.exports = {

"[externals]/timers [external] (timers, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}}),
"[project]/backend/db.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "pool": (()=>pool)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/url [external] (url, cjs)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("backend/db.js")}`;
    }
};
;
;
;
;
;
// Get the directory name in ES module scope
const __filename = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["fileURLToPath"])(__TURBOPACK__import$2e$meta__.url);
const __dirname = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(__filename);
// Construct absolute path to .env file in the parent directory
const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(__dirname, ".env");
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].config({
    path: envPath
});
// Construct absolute path to ca.pem file in the same directory
const caPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(__dirname, "ca.pem");
let caCert;
try {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(caPath)) {
        console.error(`CRITICAL_DB_INIT_ERROR: CA certificate file (ca.pem) not found at expected location: ${caPath}. Database connections requiring SSL will likely fail. Please ensure 'backend/ca.pem' exists.`);
    // caCert will remain undefined. mysql.createPool might fail if SSL is strictly required.
    } else {
        caCert = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(caPath, 'utf8');
    }
} catch (e) {
    console.error(`CRITICAL_DB_INIT_ERROR: Error reading CA certificate file (ca.pem) at ${caPath}: ${e.message}. Database connections may fail.`);
// Depending on the error, caCert might be undefined or an error could be thrown, halting further execution.
// For robustness, we could choose to throw here to make the failure explicit.
// throw new Error(`Failed to read ca.pem: ${e.message}`);
}
// Check for essential DB environment variables
const essentialEnvVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
];
const missingEnvVars = essentialEnvVars.filter((v)=>!process.env[v]);
if (missingEnvVars.length > 0) {
    console.error(`CRITICAL_DB_INIT_ERROR: Missing essential database environment variables: ${missingEnvVars.join(', ')}. These should be defined in backend/.env for local development or configured in your hosting environment. Database connections will fail.`);
    // To make the server fail fast and clearly, throwing an error here is a good practice.
    // This prevents a more obscure "Internal Server Error" later.
    throw new Error(`Missing critical DB environment variables: ${missingEnvVars.join(', ')}. Check your backend/.env file or hosting configuration.`);
}
let pool;
try {
    pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        ssl: {
            ca: caCert,
            rejectUnauthorized: true
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log("DB_INIT_SUCCESS: MySQL connection pool created (this does not guarantee successful connection yet, but configuration is loaded).");
} catch (error) {
    console.error(`CRITICAL_DB_INIT_ERROR: Failed to create MySQL connection pool: ${error.message}. This is a fatal error for database operations.`);
    // Re-throwing the error here will make the application fail on startup if the pool cannot be initialized,
    // which is often better than encountering errors later during request handling.
    throw new Error(`Failed to initialize database connection pool due to: ${error.message}. Review DB configuration (backend/.env) and SSL certificate (backend/ca.pem).`);
}
;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a4166332._.js.map