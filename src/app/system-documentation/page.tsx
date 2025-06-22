
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code2, Layers, Database, Cloud, Users, ShieldCheck, Workflow, Palette, FileText, ArrowRightLeft, FileCode2 } from "lucide-react";

export default function SystemDocumentationPage() {
  const keyFiles = [
    { name: "src/app/layout.tsx", description: "Main layout, theme provider, global styles." },
    { name: "src/components/layout/app-layout.tsx", description: "Defines the overall page structure (sidebar, header, main content)." },
    { name: "src/components/layout/sidebar.tsx", description: "Navigation sidebar component." },
    { name: "src/components/layout/header.tsx", description: "Top header bar component." },
    { name: "src/app/page.tsx", description: "Dashboard page, main entry point after login (conceptually)." },
    { name: "src/app/create-document/page.tsx", description: "Hub for creating POs, GRNs, Quotes, Requisitions, Fuel Records." },
    { name: "src/components/purchase-orders/po-form.tsx", description: "Core form for creating and editing Purchase Orders." },
    { name: "src/components/quotes/quote-form.tsx", description: "Form for creating and editing Client Quotations." },
    { name: "src/components/requisitions/requisition-form.tsx", description: "Form for creating Purchase Requisitions." },
    { name: "src/components/fuel/fuel-record-form.tsx", description: "Form for logging fuel consumption." },
    { name: "src/components/receiving/grn-interface.tsx", description: "Interface for Goods Received Note processing." },
    { name: "src/app/approvals/page.tsx", description: "Page for users to view and act on documents pending their approval." },
    { name: "src/app/management/*", description: "Pages for managing core data entities (Suppliers, Users, Sites, etc.)." },
    { name: "src/app/api/**", description: "Backend API routes (e.g., /api/purchase-orders, /api/users)." },
    { name: "backend/db.js", description: "Database connection setup (MySQL2)." },
    { name: "backend/apiRoutes.js", description: "Main Express router for backend API (referenced by Next.js API routes)." },
    { name: "scripts/*", description: "Database schema creation and alteration scripts." },
    { name: "src/types/index.ts", description: "TypeScript type definitions for the application." },
    { name: "src/config/site.ts", description: "Navigation items configuration." },
    { name: "src/app/globals.css", description: "Global styles and Tailwind CSS theme configuration." },
    { name: "tailwind.config.ts", description: "Tailwind CSS configuration file." },
    { name: "next.config.ts", description: "Next.js configuration file." },
    { name: "src/ai/genkit.ts", description: "Genkit AI SDK initialization (if Genkit is used)." },
    { name: "src/ai/flows/*", description: "Genkit flows for AI-powered features (if applicable)." },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileCode2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">System Documentation</CardTitle>
              <CardDescription>
                Overview of the ProcureTrack application architecture, key components, and development guidelines.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-muted-foreground">
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Layers className="mr-2 h-6 w-6 text-primary" /> 1. Architecture Overview
            </h2>
            <p className="mb-2">
              ProcureTrack is a full-stack web application built using the Next.js framework for both frontend (React with Server Components) and backend (API Routes).
              It leverages ShadCN UI for pre-built, accessible components styled with Tailwind CSS. The backend connects to a MySQL database for data persistence.
              Genkit is integrated for potential AI-powered features.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Frontend:</strong> Next.js (App Router), React, TypeScript, ShadCN UI, Tailwind CSS.</li>
              <li><strong>Backend:</strong> Next.js API Routes (wrapping Express.js for some existing logic), Node.js.</li>
              <li><strong>Database:</strong> MySQL (connected via `mysql2` driver). <strong>Note: A migration to Firebase Firestore is currently planned.</strong></li>
              <li><strong>AI Integration:</strong> Genkit (for future AI features).</li>
              <li><strong>Styling:</strong> Tailwind CSS with HSL CSS variables defined in `globals.css` for theming.</li>
              <li><strong>Deployment:</strong> Configured for Firebase App Hosting (see `apphosting.yaml`).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Code2 className="mr-2 h-6 w-6 text-primary" /> 2. Key Technologies & Libraries
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-foreground">Frontend:</h3>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li><strong>Next.js 15 (App Router):</strong> For routing, server components, server actions, and API routes.</li>
                  <li><strong>React 18:</strong> For building the user interface.</li>
                  <li><strong>TypeScript:</strong> For static typing and improved code quality.</li>
                  <li><strong>ShadCN UI:</strong> For accessible and customizable UI components.</li>
                  <li><strong>Tailwind CSS:</strong> For utility-first CSS styling.</li>
                  <li><strong>Lucide React:</strong> For icons.</li>
                  <li><strong>Recharts:</strong> For data visualization (charts).</li>
                  <li><strong>React Hook Form:</strong> For managing form state and validation.</li>
                  <li><strong>Zod:</strong> For schema validation (often with React Hook Form).</li>
                  <li><strong>Date-fns:</strong> For date formatting and manipulation.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Backend & Database:</h3>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li><strong>Next.js API Routes:</strong> Primary mechanism for backend endpoints.</li>
                  <li><strong>Express.js:</strong> Some existing API logic in `backend/apiRoutes.js` uses Express conventions, integrated into Next.js API routes.</li>
                  <li><strong>Node.js:</strong> Runtime environment.</li>
                  <li><strong>MySQL2:</strong> Node.js driver for MySQL database interaction. <strong>(To be replaced by Firebase Admin SDK)</strong>.</li>
                  <li><strong>Firebase Admin SDK:</strong> For backend interaction with Firebase services (Firestore). <strong>(Planned)</strong></li>
                  <li><strong>Dotenv:</strong> For managing environment variables (e.g., database credentials in `backend/.env`).</li>
                  <li><strong>Multer:</strong> For handling file uploads (e.g., CSV imports).</li>
                  <li><strong>CSV-Parser:</strong> For parsing uploaded CSV files.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground">AI & Other:</h3>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li><strong>Genkit & @genkit-ai/googleai:</strong> For integrating Generative AI features using Google's AI models.</li>
                  <li><strong>Playwright:</strong> (Used in `pages/api/generate-po-pdf.ts`) For server-side PDF generation by rendering HTML in a headless browser.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Database className="mr-2 h-6 w-6 text-primary" /> 3. Database Schema
            </h2>
            <p className="mb-2">
              The database schema is managed through SQL scripts located in the `/scripts` directory. These scripts include `CREATE TABLE` statements for all primary entities and `ALTER TABLE` scripts for modifications.
              Key tables include:
            </p>
            <div className="p-3 border-l-4 border-amber-500 bg-amber-50 text-amber-800 rounded-r-md text-xs mt-2">
              <h4 className="font-bold mb-1">Note on Migration:</h4>
              <p>The current SQL scripts are for the legacy MySQL setup. With the planned migration to Firebase, the database schema will be managed using Firestore's NoSQL collection/document model. The existing scripts will be archived and will no longer represent the active database structure post-migration.</p>
            </div>
            <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
              <li>`PurchaseOrder`, `POItem`</li>
              <li>`Supplier`, `Approver`, `User`, `Site`, `Category`</li>
              <li>`Quote`, `QuoteItem`, `Client`</li>
              <li>`Requisition`, `RequisitionItem`</li>
              <li>`Tag` (for vehicles/equipment), `FuelRecord`</li>
              <li>`ActivityLog`, `UserSiteAccess`</li>
            </ul>
            <p className="mt-2 text-xs">
              Refer to the individual `.js` files in the `/scripts` directory for detailed `CREATE TABLE` and `ALTER TABLE` statements for the MySQL implementation.
              The `backend/db.js` file handles the database connection pool configuration using environment variables from `backend/.env`.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Palette className="mr-2 h-6 w-6 text-primary" /> 4. Styling & Theming
            </h2>
            <p className="mb-2">
              Styling is primarily handled by Tailwind CSS. A custom theme (colors, radius, etc.) is defined in `src/app/globals.css` using HSL CSS variables.
              This allows for easy theme switching (e.g., dark mode) and consistent styling across ShadCN UI components and custom elements.
              The `ThemeProvider` from `next-themes` is used in `src/app/layout.tsx` to manage theme state.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" /> 5. Key Files & Directories
            </h2>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
              {keyFiles.map((file) => (
                <div key={file.name} className="p-3 border rounded-md bg-muted/30 text-sm">
                  <p className="font-mono font-medium text-foreground/80 break-all">{file.name}</p>
                  <p className="text-xs mt-1">{file.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Workflow className="mr-2 h-6 w-6 text-primary" /> 6. Core Workflows
            </h2>
            <ul className="list-disc list-inside ml-4 space-y-2 text-sm">
              <li>
                <strong>Purchase Order Creation:</strong> User fills POForm -> API (`/api/purchase-orders`) creates PO and POItems -> Status set to 'Pending Approval'. Can load items from approved Requisitions.
              </li>
              <li>
                <strong>Document Approval:</strong> Approver views documents on '/approvals' -> Approves/Rejects via API calls (e.g., `/api/purchase-orders/[id]/approve`).
              </li>
               <li>
                <strong>Quotation Creation:</strong> User fills QuoteForm -> API (`/api/quotes`) creates Quote and QuoteItems. Status is 'Draft' or 'Pending Approval' based on approver assignment.
              </li>
              <li>
                <strong>Requisition Creation:</strong> User fills RequisitionForm -> API (`/api/requisitions`) creates Requisition and RequisitionItems. Status is 'Draft' or 'Pending Approval'.
              </li>
              <li>
                <strong>Goods Receiving (GRN):</strong> User searches for an 'Approved' PO -> Enters received quantities -> (Simulated) API call to update received quantities on POItems.
              </li>
              <li>
                <strong>Fuel Recording:</strong> User fills FuelRecordForm -> API (`/api/fuel-records`) saves the entry.
              </li>
              <li>
                <strong>Data Management:</strong> Admins use '/management/*' pages -> Forms interact with respective APIs (e.g., `/api/users`, `/api/sites`) for CRUD operations. CSV upload available for Clients, Suppliers, Tags.
              </li>
              <li>
                <strong>PDF Generation:</strong> PO print page (`/purchase-orders/[id]/print`) -> Server-side API (`/pages/api/generate-po-pdf.ts`) uses Playwright to render HTML to PDF.
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <ArrowRightLeft className="mr-2 h-6 w-6 text-primary" /> 7. API Routes & Backend Logic
            </h2>
            <p className="mb-2">
              Most backend logic is handled by Next.js API Routes in the `src/app/api/` directory. These routes typically:
            </p>
            <ul className="list-disc list-inside ml-4 text-sm space-y-1">
              <li>Connect to the MySQL database using the pool from `backend/db.js`.</li>
              <li>Perform CRUD (Create, Read, Update, Delete) operations on database tables.</li>
              <li>Handle request validation and formatting responses.</li>
              <li>For file uploads (CSV), routes use `multer` for parsing `multipart/form-data`.</li>
            </ul>
            <p className="mt-2">
              An older Express.js router exists in `backend/apiRoutes.js`, primarily for initial PO and Supplier fetching, but new development should prioritize Next.js API Routes for consistency.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Cloud className="mr-2 h-6 w-6 text-primary" /> 8. Deployment & Environment
            </h2>
            <p className="mb-2">
              The application is configured for deployment on Firebase App Hosting, as indicated by `apphosting.yaml`.
              Environment variables for database connection (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) and potentially other services (e.g., API keys for Google AI) are managed in `backend/.env` for local development. These must be configured in the Firebase App Hosting environment for production.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <ShieldCheck className="mr-2 h-6 w-6 text-primary" /> 9. Security Considerations (Current State & Future)
            </h2>
            <ul className="list-disc list-inside ml-4 text-sm space-y-1">
              <li><strong>Authentication/Authorization:</strong> Currently mocked (e.g., hardcoded approver email). Full user authentication (e.g., Firebase Auth, NextAuth.js) and role-based access control (RBAC) are critical future enhancements.</li>
              <li><strong>Input Validation:</strong> Forms use `react-hook-form` with `zod` for client-side validation. Backend API routes should also implement robust input validation to prevent injection attacks and ensure data integrity.</li>
              <li><strong>API Security:</strong> API routes should be protected to ensure only authenticated and authorized users can perform sensitive operations.</li>
              <li><strong>Database Security:</strong> Use parameterized queries (as done by `mysql2` by default when using `?` placeholders) to prevent SQL injection. Ensure database user has least privilege.</li>
              <li><strong>File Uploads:</strong> Validate file types, sizes, and sanitize filenames for CSV uploads.</li>
              <li><strong>Error Handling:</strong> Consistent error handling on both frontend and backend to provide informative messages without leaking sensitive information.</li>
            </ul>
          </section>

           <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" /> 10. Future Enhancements & Roadmap
            </h2>
            <p className="mb-2">
              This section outlines potential future developments and improvements for ProcureTrack:
            </p>
            <ul className="list-disc list-inside ml-4 text-sm space-y-1">
              <li><strong>Full User Authentication & Authorization:</strong> Implement robust login, user roles (Admin, Creator, Approver, Viewer, Manager), and permission-based access control for all features and data.</li>
              <li><strong>Complete Backend Integration:</strong> Ensure all forms and data tables are fully connected to the MySQL database via robust API endpoints for all CRUD operations (Suppliers, Categories, Tags, Clients, etc.).</li>
              <li><strong>Advanced CSV Data Upload:</strong> Enhance CSV upload functionality for more entities (e.g., Purchase Orders, Fuel Records) with robust validation, error reporting, and preview capabilities. Provide downloadable templates for all applicable entities.</li>
              <li><strong>Comprehensive GRN Functionality:</strong> Implement actual item receipt processing, including stock level updates (if applicable), back-order handling, and PO status updates (e.g., 'Partially Received', 'Fully Received').</li>
              <li><strong>Detailed Reporting Module:</strong> Develop a dynamic reporting module allowing users to generate custom reports on PO status, spend analysis by vendor/category/site, GRN summaries, and more. Include export options (Excel, PDF).</li>
              <li><strong>Real-time Notifications:</strong> Integrate email or in-app notifications for events like PO submission, approval/rejection, GRN processing, and low stock alerts (if inventory is tracked).</li>
              <li><strong>Genkit AI Features:</strong>
                <ul className="list-['-_'] list-inside ml-4">
                  <li>AI-assisted form filling or data extraction from uploaded documents (e.g., supplier invoices to pre-fill GRN).</li>
                  <li>Natural language querying for data retrieval (e.g., "Show me all POs for Site X approved last month").</li>
                  <li>AI-powered spend analysis and anomaly detection.</li>
                  <li>Automated summary generation for reports or complex documents.</li>
                </ul>
              </li>
              <li><strong>Inventory Management Module (Optional):</strong> If required, add functionality to track inventory levels, manage stock movements, and link with procurement.</li>
              <li><strong>Budgeting & Cost Control:</strong> Allow setting budgets per department/site/project and track actual spend against these budgets.</li>
              <li><strong>User Profile & Settings:</strong> Enable users to manage their profile, preferences, and notification settings.</li>
              <li><strong>Enhanced Audit Trails:</strong> More detailed and searchable activity logs for comprehensive auditing.</li>
              <li><strong>Mobile Responsiveness & PWA:</strong> Improve mobile usability and explore Progressive Web App (PWA) capabilities for offline access or better mobile experience.</li>
              <li><strong>Internationalization (i18n):</strong> Support for multiple languages if required for different user groups.</li>
              <li><strong>Integration with Accounting Systems:</strong> API integrations to sync procurement data with common accounting software.</li>
              <li><strong>Supplier Portal (Optional):</strong> A separate interface for suppliers to view POs, submit invoices, and update their information.</li>
              <li><strong>Performance Optimization:</strong> Continuously monitor and optimize database queries, API response times, and frontend rendering performance.</li>
              <li><strong>Automated Testing:</strong> Implement unit, integration, and end-to-end tests to ensure application stability and reliability.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
