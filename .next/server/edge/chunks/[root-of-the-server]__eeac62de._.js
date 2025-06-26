(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__eeac62de._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:util [external] (node:util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}}),
"[externals]/node:events [external] (node:events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}}),
"[externals]/node:assert [external] (node:assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:assert", () => require("node:assert"));

module.exports = mod;
}}),
"[project]/src/lib/firebase/server.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// This file is for SERVER-SIDE use only.
// It initializes the Firebase Admin SDK.
__turbopack_context__.s({
    "getAuth": (()=>getAuth),
    "getFirestore": (()=>getFirestore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$app$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase-admin/lib/esm/app/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase-admin/lib/esm/auth/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$firestore$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase-admin/lib/esm/firestore/index.js [middleware-edge] (ecmascript)");
;
;
;
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};
function getAdminApp() {
    // Check if the default app is already initialized
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$app$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getApps"])().some((app)=>app.name === '[DEFAULT]')) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$app$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getApp"])();
    }
    // Check for credentials before initializing to provide a clearer error
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error('Firebase Admin credentials are not set in the environment. Please check your .env.local file.');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$app$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["initializeApp"])({
        credential: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$app$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cert"])(serviceAccount)
    });
}
const getAuth = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$auth$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getAuth"])(getAdminApp());
const getFirestore = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$2f$lib$2f$esm$2f$firestore$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getFirestore"])(getAdminApp());
}}),
"[project]/backend [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__import_unsupported(`path`));
}}),
"[project]/backend [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__import_unsupported(`fs`));
}}),
"[project]/backend/db.js [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "pool": (()=>pool)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$native$2d$url$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/native-url/index.js [middleware-edge] (ecmascript)");
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
const __filename = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$native$2d$url$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["fileURLToPath"])(__TURBOPACK__import$2e$meta__.url);
const __dirname = __TURBOPACK__imported__module__$5b$project$5d2f$backend__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].dirname(__filename);
// Construct absolute path to .env file in the parent directory
const envPath = __TURBOPACK__imported__module__$5b$project$5d2f$backend__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].resolve(__dirname, ".env");
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].config({
    path: envPath
});
// Construct absolute path to ca.pem file in the same directory
const caPath = __TURBOPACK__imported__module__$5b$project$5d2f$backend__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].resolve(__dirname, "ca.pem");
let caCert;
try {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$backend__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].existsSync(caPath)) {
        console.error(`CRITICAL_DB_INIT_ERROR: CA certificate file (ca.pem) not found at expected location: ${caPath}. Database connections requiring SSL will likely fail. Please ensure 'backend/ca.pem' exists.`);
    // caCert will remain undefined. mysql.createPool might fail if SSL is strictly required.
    } else {
        caCert = __TURBOPACK__imported__module__$5b$project$5d2f$backend__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].readFileSync(caPath, 'utf8');
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
    pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].createPool({
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
"[project]/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/server.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/db.js [middleware-edge] (ecmascript)");
;
;
;
;
const PROTECTED_ROUTES = [
    '/',
    '/create-document',
    '/approvals',
    '/activity-log',
    '/analytics',
    '/reports',
    '/management'
];
const AUTH_ROUTE = '/auth';
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Skip middleware for static files, API routes, and Next.js internals
    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.startsWith('/static/') || [
        '/favicon.ico',
        '/jachris-logo.png',
        '/headerlogo.png'
    ].includes(pathname)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const sessionCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])().get(process.env.SESSION_COOKIE_NAME)?.value;
    // Redirect to auth page if trying to access a protected route without a session
    if (!sessionCookie && PROTECTED_ROUTES.some((p)=>pathname.startsWith(p))) {
        const url = request.nextUrl.clone();
        url.pathname = AUTH_ROUTE;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    try {
        if (sessionCookie) {
            // 1. Verify the Firebase session cookie. If invalid, it will throw an error.
            const decodedToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getAuth"])().verifySessionCookie(sessionCookie, true);
            // 2. Check if the user exists and is active in the application's database.
            if (!decodedToken.email) {
                throw new Error('No email found in Firebase token.');
            }
            const [userRows] = await __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["pool"].execute('SELECT id, role, isActive FROM User WHERE email = ?', [
                decodedToken.email
            ]);
            if (userRows.length === 0) {
                throw new Error(`User with email ${decodedToken.email} not found in application database.`);
            }
            const appUser = userRows[0];
            if (!appUser.isActive) {
                throw new Error(`User ${decodedToken.email} is inactive.`);
            }
            // If checks pass, user is valid.
            // If authenticated user tries to access the auth page, redirect to home
            if (pathname === AUTH_ROUTE) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', request.url));
            }
        }
    } catch (error) {
        // Catches errors from verifySessionCookie and our custom authorization checks.
        console.error('Middleware auth error:', error.message);
        // Session cookie is invalid or user not authorized. Clear it and redirect to auth page.
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(AUTH_ROUTE, request.url));
        response.cookies.set(process.env.SESSION_COOKIE_NAME, '', {
            maxAge: -1
        });
        return response;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */ '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__eeac62de._.js.map