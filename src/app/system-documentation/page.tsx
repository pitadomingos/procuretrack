
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileCode, Users, Server, Database, Brain, ArrowDown, FolderKanban, FileJson, Settings2, Palette, Router, Component, Library, Type, BrainCircuit, ServerCog, Layers, Cloud, ShieldCheck, Bell, Globe, Smartphone, BarChartHorizontal, TestTube2 } from "lucide-react";

export default function SystemDocumentationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileCode className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">ProcureTrack System Documentation</CardTitle>
              <CardDescription>
                Technical details about the ProcureTrack application architecture and components.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">1. Introduction</h2>
            <p>
              This document provides a technical overview of the ProcureTrack application, designed to streamline procurement and related operational processes. It covers the system architecture, key components, data management, and deployment considerations. This is a living document and will be updated as the system evolves.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">2. System Architecture</h2>
            <p className="mb-3">
              ProcureTrack is a modern web application leveraging a client-server architecture, with a distinct frontend application, a backend API layer for data operations, and an AI backend for intelligent features.
            </p>
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">2.1 Frontend (Client Application)</h3>
                <ul className="list-disc list-inside ml-4">
                  <li><strong>Framework:</strong> Next.js (v15) utilizing the App Router.</li>
                  <li><strong>Language:</strong> TypeScript.</li>
                  <li><strong>UI Components:</strong> ShadCN UI, a collection of beautifully designed components built with Radix UI and Tailwind CSS.</li>
                  <li><strong>Styling:</strong> Tailwind CSS for utility-first styling.</li>
                  <li><strong>Key Next.js Features:</strong>
                    <ul className="list-circle list-inside ml-6">
                      <li>React Server Components (RSC) for efficient data fetching and rendering.</li>
                      <li>Client Components for interactivity.</li>
                      <li>API Route Handlers (Next.js specific, for direct backend logic within the Next.js app, distinct from the separate Express API).</li>
                      <li>Server Actions for mutations and form submissions directly from components.</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">2.2 Backend API (Data Services)</h3>
                 <ul className="list-disc list-inside ml-4">
                  <li><strong>Framework:</strong> Node.js with Express.js.</li>
                  <li><strong>Language:</strong> JavaScript (as per existing ` + "`backend/`" + ` folder scripts).</li>
                  <li><strong>Purpose:</strong> Provides RESTful APIs for core data operations (CRUD) against the MySQL database. This API is consumed by the Next.js frontend (e.g., via \`fetch\` in Server Components or Route Handlers).</li>
                  <li><strong>Authentication (Future):</strong> Token-based authentication (e.g., JWT) will be implemented to secure API endpoints.</li>
                </ul>
              </div>
               <div>
                <h3 className="text-lg font-medium text-foreground">2.3 AI Backend (Intelligent Services)</h3>
                 <ul className="list-disc list-inside ml-4">
                  <li><strong>Toolkit:</strong> Genkit (by Google).</li>
                  <li><strong>Models:</strong> Google AI (e.g., Gemini family for text generation, analysis, and potentially image generation).</li>
                  <li><strong>Purpose:</strong> To handle generative AI functionalities such as AI-assisted form filling, data summarization, anomaly detection, and intelligent search. Genkit flows will be defined and invoked from Next.js Server Actions or API routes.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">2.4 Database</h3>
                <ul className="list-disc list-inside ml-4">
                  <li><strong>Type:</strong> MySQL (Relational Database Management System).</li>
                  <li><strong>Interaction:</strong> The Express.js backend API primarily handles direct database connections and queries using the \`mysql2\` library.</li>
                  <li><strong>Schema Management:</strong> Database schema is defined and managed through JavaScript scripts located in the \`scripts/\` directory (e.g., \`create_*.js\`, \`alter_*.js\`).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">2.5 Hosting & Deployment</h3>
                 <ul className="list-disc list-inside ml-4">
                  <li><strong>Frontend (Next.js):</strong> Firebase App Hosting, configured via \`apphosting.yaml\`. This platform supports server-side rendering, API routes, and other Next.js features.</li>
                  <li><strong>Backend API (Express.js):</strong> Can be deployed in several ways:
                    <ul className="list-circle list-inside ml-6">
                      <li>Co-located with Next.js on Firebase App Hosting if configured to serve Express apps.</li>
                      <li>As a separate service (e.g., Google Cloud Run, Cloud Functions) for scalability and independent management.</li>
                    </ul>
                  </li>
                  <li><strong>Database Hosting:</strong> Typically a managed MySQL service (e.g., Google Cloud SQL, AWS RDS, or other cloud provider solutions) is recommended for production.</li>
                  <li><strong>AI Backend (Genkit):</strong> Genkit flows can be deployed as serverless functions (e.g., Google Cloud Functions) or integrated within the Next.js backend environment.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">2.6 Data Flow Overview</h3>
                <div className="my-6 p-4 border border-dashed rounded-md bg-muted/20 flex flex-col items-center space-y-4">
                  <h4 className="text-md font-semibold text-center mb-2 text-foreground">ProcureTrack High-Level Data Flow</h4>
                  <div className="w-full max-w-lg p-4 border-2 border-dashed border-border rounded-lg text-center bg-card shadow-sm">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h5 className="text-md font-semibold mb-1 text-card-foreground">User Interface (Browser)</h5>
                    <p className="text-xs text-muted-foreground">Next.js (React, ShadCN UI, Tailwind CSS)</p>
                  </div>
                  <ArrowDown className="h-6 w-6 text-muted-foreground" />
                  <div className="w-full max-w-lg p-4 border-2 border-dashed border-border rounded-lg text-center bg-card shadow-sm">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h5 className="text-md font-semibold mb-1 text-card-foreground">Next.js Application Server</h5>
                    <p className="text-xs text-muted-foreground">(App Router, Server Components, API Routes, Server Actions)</p>
                  </div>
                   <div className="flex justify-around w-full mt-2">
                      <div className="flex flex-col items-center w-1/2 px-2">
                        <ArrowDown className="h-6 w-6 text-muted-foreground" />
                        <div className="w-full max-w-md mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center bg-card shadow-sm">
                          <Server className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h5 className="text-sm font-semibold mb-1 text-card-foreground">Backend Data API</h5>
                          <p className="text-xs text-muted-foreground">(Node.js/Express)</p>
                        </div>
                        <ArrowDown className="h-6 w-6 text-muted-foreground mt-2" />
                         <div className="w-full max-w-md mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center bg-card shadow-sm">
                            <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <h5 className="text-sm font-semibold mb-1 text-card-foreground">MySQL Database</h5>
                          </div>
                      </div>
                      <div className="flex flex-col items-center w-1/2 px-2">
                        <ArrowDown className="h-6 w-6 text-muted-foreground" />
                        <div className="w-full max-w-md mt-2 p-4 border-2 border-dashed border-border rounded-lg text-center bg-card shadow-sm">
                          <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h5 className="text-sm font-semibold mb-1 text-card-foreground">AI Services (Genkit)</h5>
                          <p className="text-xs text-muted-foreground">(Google AI / Gemini Models)</p>
                        </div>
                      </div>
                   </div>
                </div>
                <p className="ml-4">
                  A user interacts with the Next.js frontend. Client-side interactions trigger requests to the Next.js backend (API Routes or Server Actions).
                  For data-centric operations, the Next.js backend calls the dedicated Express.js API, which then interacts with the MySQL database.
                  For AI-powered features, the Next.js backend invokes Genkit flows, which interface with Google AI models.
                  Responses flow back through these layers to update the UI.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">3. Frontend Overview</h2>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>Routing:</strong> Utilizes the Next.js App Router. Routes are defined by folder structure within \`src/app/\`. Dynamic routes use bracket notation (e.g., \`src/app/purchase-orders/[id]/page.tsx\`).</li>
              <li><strong>State Management:</strong>
                <ul className="list-circle list-inside ml-6">
                  <li><strong>Local Component State:</strong> \`useState\` and \`useEffect\` hooks for managing state within individual components.</li>
                  <li><strong>Global State:</strong> React Context API is used for simpler global state needs (e.g., \`SidebarProvider\` for sidebar open/close state, \`ThemeProvider\` for dark/light mode). For more complex global state or server cache management, libraries like Zustand or React Query might be considered in the future.</li>
                  <li><strong>Server Cache & Mutations:</strong> Data fetching primarily relies on \`fetch\` within Server Components or API Route Handlers. Server Actions are used for mutations, inherently providing a mechanism for revalidating data or redirecting.</li>
                </ul>
              </li>
              <li><strong>UI Conventions:</strong> Follows the design principles of ShadCN UI, emphasizing composability and accessibility. Tailwind CSS is used for all styling, promoting utility-first design.</li>
              <li><strong>Key UI Components:</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>\`AppLayout\`, \`AppHeader\`, \`AppSidebar\`: Define the main application structure.</li>
                  <li>\`DataTable\`: A reusable component for displaying tabular data with sorting and filtering capabilities (custom built).</li>
                  <li>Forms (e.g., \`POForm\`, \`QuoteForm\`, \`RequisitionForm\`): Built using React Hook Form for validation and submission handling.</li>
                  <li>ShadCN UI Primitives: Buttons, Cards, Dialogs, Selects, Inputs, etc., form the building blocks of the UI.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">4. Backend API Details</h2>
            <p>The backend is split into two main parts: the data-centric Express.js API and Next.js API Routes/Server Actions for frontend-specific backend logic.</p>
            <h3 className="text-lg font-medium mt-3 mb-1 text-foreground">4.1 Express.js API (Data Services)</h3>
            <p>Located in \`backend/\`. Primarily handles CRUD operations against the database.</p>
            <ul className="list-disc list-inside ml-4">
                <li>GET \`/api/suppliers\`: Fetches all suppliers.</li>
                <li>GET \`/api/purchase-orders\`: Fetches all purchase orders.</li>
                <li>GET \`/api/purchase-orders/:poId\`: Fetches a single purchase order by ID.</li>
                <li>GET \`/api/purchase-orders/:poId/items\`: Fetches items for a specific PO.</li>
                <li>POST \`/api/upload/*\`: Placeholder endpoints for various CSV file uploads (functionality partially implemented via Next.js API routes).</li>
            </ul>
            <h3 className="text-lg font-medium mt-3 mb-1 text-foreground">4.2 Next.js API Routes & Server Actions</h3>
            <p>Located in \`src/app/api/\` (for API routes) and within components for Server Actions.</p>
            <ul className="list-disc list-inside ml-4">
              <li>CRUD endpoints for: \`approvers\`, \`categories\`, \`clients\`, \`purchase-orders\`, \`quotes\`, \`requisitions\`, \`sites\`, \`suppliers\`, \`tags\`, \`users\`.</li>
              <li>Specialized GET endpoints for:
                <ul className="list-circle list-inside ml-6">
                  <li>Next PO/Quote/Requisition numbers (e.g., \`/api/purchase-orders/next-po-number\`).</li>
                  <li>Pending approval queues (e.g., \`/api/purchase-orders/pending-approval\`).</li>
                  <li>Dashboard statistics and chart data (e.g., \`/api/dashboard-stats\`, \`/api/charts/*\`).</li>
                </ul>
              </li>
              <li>POST endpoints for actions like approving/rejecting documents (e.g., \`/api/purchase-orders/[poId]/approve\`).</li>
              <li>POST endpoints for CSV uploads (e.g., \`/api/clients\` handles CSV if content-type is multipart/form-data).</li>
              <li>API for PDF generation: \`src/pages/api/generate-po-pdf.ts\` (using Playwright).</li>
            </ul>
             <p className="mt-2">Request/response formats are typically JSON. Authentication is planned for future implementation.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">5. Database Schema</h2>
            <p>
              The database is MySQL. Schema definition and initial data seeding are managed by scripts in the \`scripts/\` directory.
              Key tables include:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>User:</strong> Stores user information (ID, name, email, role, active status).</li>
              <li><strong>Approver:</strong> Defines users who can approve documents, including approval limits.</li>
              <li><strong>Site:</strong> Manages company sites/locations (name, location, site code).</li>
              <li><strong>UserSiteAccess:</strong> Maps users to sites they have access to (many-to-many).</li>
              <li><strong>Category:</strong> Defines categories for items/services.</li>
              <li><strong>Supplier:</strong> Information about vendors/suppliers.</li>
              <li><strong>Client:</strong> Information about customers/clients for quotations.</li>
              <li><strong>Tag:</strong> Details for tagged assets (vehicles, equipment), including status and assigned site.</li>
              <li><strong>Requisition:</strong> Header information for internal purchase requests (number, date, requestor, site, status, justification, assigned approver).</li>
              <li><strong>RequisitionItem:</strong> Line items for requisitions (description, category, quantity, item-specific site).</li>
              <li><strong>PurchaseOrder:</strong> Header information for POs (number, date, creator, supplier, approver, site, status, totals).</li>
              <li><strong>POItem:</strong> Line items for POs (description, category, site, quantity, unit price, received quantity, item status).</li>
              <li><strong>Quote:</strong> Header information for client quotations (number, date, client, creator, status, totals, assigned approver).</li>
              <li><strong>QuoteItem:</strong> Line items for quotations (description, quantity, unit price).</li>
              <li><strong>FuelRecord:</strong> Logs fuel consumption (date, tag, site, driver, odometer, quantity, cost).</li>
              <li><strong>ActivityLog:</strong> (Schema exists) Intended for tracking system and user actions.</li>
            </ul>
            <p className="mt-1">Relationships are enforced using foreign keys (e.g., \`POItem.poId\` references \`PurchaseOrder.id\`).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">6. Deployment Process</h2>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li><strong>Environment Setup:</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>Ensure Node.js and npm/yarn are installed.</li>
                  <li>Set up a MySQL database instance (local or cloud-based).</li>
                  <li>Configure environment variables (e.g., in a \`.env\` file locally, or via hosting provider settings for deployment) for database connection details (host, user, password, database name), API keys, etc. The \`backend/db.js\` file uses these variables.</li>
                </ul>
              </li>
              <li><strong>Database Initialization:</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>Run the table creation scripts from the \`scripts/\` directory (e.g., \`node scripts/create_users_table.js\`) in the correct order to set up the database schema.</li>
                  <li>Optionally, run \`insert_*.js\` scripts to populate tables with sample data.</li>
                  <li>Run any \`alter_*.js\` migration scripts if updating an existing database.</li>
                </ul>
              </li>
              <li><strong>Build Application:</strong> Run \`npm run build\` (or \`yarn build\`) to create an optimized production build of the Next.js application.</li>
              <li><strong>Deploy Frontend (Next.js):</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>For Firebase App Hosting:
                    <ol className="list-decimal list-inside ml-8">
                      <li>Ensure Firebase CLI is installed and configured (\`firebase login\`).</li>
                      <li>Initialize Firebase in the project if not already done (\`firebase init hosting\`).</li>
                      <li>Configure \`apphosting.yaml\` for server-side rendering settings, instance count, etc.</li>
                      <li>Deploy using \`firebase deploy --only hosting\`.</li>
                    </ol>
                  </li>
                </ul>
              </li>
              <li><strong>Deploy Backend API (Express.js):</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>If co-locating with Next.js on App Hosting, ensure \`apphosting.yaml\` is set up to serve the Express app.</li>
                  <li>If deploying separately (e.g., Cloud Run), package the \`backend/\` directory, configure its \`Dockerfile\` or service settings, and deploy to the chosen platform. Ensure the Next.js app's API calls point to the correct deployed backend URL.</li>
                </ul>
              </li>
              <li><strong>SSL Certificate:</strong> Ensure SSL is configured for production deployments (usually handled by the hosting provider like Firebase App Hosting).</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">7. Key Project Files & Folders</h2>
            <p className="mb-2">
              An overview of the most important files and directories in the ProcureTrack application:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                <FolderKanban className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>/</code> (Root Directory)</strong>
                <ul className="list-circle list-inside ml-6">
                  <li><code>next.config.ts</code>: Configuration for Next.js, including image optimization, build settings, and experimental features.</li>
                  <li><code>tailwind.config.ts</code>: Configuration for Tailwind CSS, defining theme customizations, plugins, and content paths.</li>
                  <li><code>package.json</code>: Lists project dependencies, scripts (dev, build, start), and project metadata.</li>
                  <li><code>apphosting.yaml</code>: Configuration for deploying to Firebase App Hosting.</li>
                  <li><code>tsconfig.json</code>: TypeScript compiler options.</li>
                  <li><code>components.json</code>: Configuration for ShadCN UI.</li>
                </ul>
              </li>
              <li>
                <Router className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>src/app/</code></strong>: Core directory for Next.js App Router.
                <ul className="list-circle list-inside ml-6">
                  <li><code>globals.css</code>: Global stylesheets, Tailwind base styles, and CSS variables for ShadCN UI themes.</li>
                  <li><code>layout.tsx</code>: Root layout component.</li>
                  <li><code>page.tsx</code>: Entry point for the dashboard page (\`/\`).</li>
                  <li><code>(group)/route/page.tsx</code>: Pattern for pages and route segments.</li>
                  <li><code>api/</code>: Contains backend API route handlers managed by Next.js.</li>
                </ul>
              </li>
              <li>
                <Component className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>src/components/</code></strong>: Reusable React components.
                <ul className="list-circle list-inside ml-6">
                  <li><code>ui/</code>: ShadCN UI components.</li>
                  <li><code>shared/</code>: Custom reusable components (e.g., \`FilterBar\`, \`DataTable\`).</li>
                  <li><code>layout/</code>: Application structure components (e.g., \`AppLayout\`, \`AppHeader\`, \`AppSidebar\`).</li>
                  <li>Feature-specific folders (e.g., \`dashboard/\`, \`purchase-orders/\`, \`management/\`).</li>
                </ul>
              </li>
              <li>
                <Library className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>src/lib/</code></strong>: Utility functions and libraries.
                <ul className="list-circle list-inside ml-6">
                  <li><code>utils.ts</code>: General utility functions (e.g., \`cn\`).</li>
                  <li><code>mock-data.ts</code>: Contains mock data (phasing out as backend integration completes).</li>
                </ul>
              </li>
              <li>
                <Settings2 className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>src/config/</code></strong>: Application-level configurations (e.g., \`site.ts\` for navigation).</li>
              </li>
              <li>
                <Type className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>src/types/</code></strong>: TypeScript type definitions (\`index.ts\`).</li>
              </li>
              <li>
                <BrainCircuit className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>src/ai/</code></strong>: AI-related functionality using Genkit.
                <ul className="list-circle list-inside ml-6">
                  <li><code>genkit.ts</code>: Genkit instance initialization.</li>
                  <li><code>dev.ts</code>: For local Genkit development.</li>
                  <li><code>flows/</code>: (Future) Genkit flow definitions.</li>
                </ul>
              </li>
              <li>
                <ServerCog className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>backend/</code></strong>: Node.js/Express.js backend API.
                <ul className="list-circle list-inside ml-6">
                  <li><code>apiRoutes.js</code>: Express routes for data operations.</li>
                  <li><code>db.js</code>: MySQL database connection pool.</li>
                  <li><code>uploadRoutes.js</code>: Placeholder upload routes.</li>
                  <li><code>.env</code>: Environment variables (local).</li>
                  <li><code>ca.pem</code>: SSL certificate for DB.</li>
                </ul>
              </li>
               <li>
                <Database className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>scripts/</code></strong>: Database schema and data management scripts.
                <ul className="list-circle list-inside ml-6">
                  <li><code>create_*.js</code>: Table creation scripts.</li>
                  <li><code>insert_*.js</code>: Sample data insertion scripts.</li>
                  <li><code>alter_*.js</code>: Table alteration/migration scripts.</li>
                </ul>
              </li>
               <li>
                <FileJson className="inline-block h-5 w-5 mr-2 text-primary align-text-bottom" />
                <strong><code>public/</code></strong>: Static assets.
                <ul className="list-circle list-inside ml-6">
                    <li><code>jachris-logo.png</code>, <code>headerlogo.png</code>: Company logos.</li>
                    <li><code>signatures/</code>: (If used) Placeholder for approver signature images.</li>
                    <li><code>templates/</code>: CSV templates for data upload.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">8. Future Enhancements & Roadmap</h2>
            <p className="mb-3">
              The following is a high-level roadmap of planned features and improvements for ProcureTrack:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                <Database className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Full Backend & Database Integration:</strong> Complete CRUD operations for all remaining entities (Suppliers, Users, Approvers, Categories, Tags, Clients, etc.) with robust API and database interactions.
              </li>
              <li>
                <FileCode className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Complete Workflow Implementation:</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>Full GRN lifecycle: stock updates, partial receipts, back-order management.</li>
                  <li>Fuel Record management: advanced analytics, potentially linking to vehicle maintenance.</li>
                  <li>Client Quotation workflow: conversion to order, tracking.</li>
                  <li>Purchase Requisition workflow: from request to PO generation, status tracking.</li>
                </ul>
              </li>
              <li>
                <BarChartHorizontal className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Advanced Reporting & Analytics:</strong> Develop dynamic and customizable reports (e.g., spend analysis, vendor performance, inventory levels, budget vs. actuals). Integrate more sophisticated charting and data visualization.
              </li>
              <li>
                <ShieldCheck className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>User Authentication & Authorization:</strong> Implement a secure login system (e.g., Firebase Authentication, custom JWT). Define user roles and permissions to control access to features and data.
              </li>
              <li>
                <BrainCircuit className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Genkit AI Features:</strong>
                <ul className="list-circle list-inside ml-6">
                  <li>AI-assisted data entry and form completion.</li>
                  <li>Natural language querying for reports/data.</li>
                  <li>Anomaly detection in spending or consumption patterns.</li>
                  <li>Automated summarization of documents or activity logs.</li>
                </ul>
              </li>
              <li>
                <Bell className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Real-time Notifications:</strong> Implement email or in-app notifications for key events (e.g., PO approval requests, rejections, GRN status changes).
              </li>
              <li>
                <Users className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>User Profile & Settings:</strong> Allow users to manage their profiles, preferences, and notification settings.
              </li>
              <li>
                <Smartphone className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Mobile Responsiveness & PWA:</strong> Enhance mobile usability and explore Progressive Web App (PWA) capabilities for offline access or better mobile experience.
              </li>
               <li>
                <TestTube2 className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Comprehensive Testing:</strong> Implement unit, integration, and end-to-end (E2E) testing strategies to ensure application stability and reliability.
              </li>
              <li>
                <Globe className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Internationalization (i18n):</strong> Support for multiple languages and regional formats if required.
              </li>
               <li>
                <Cloud className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>Performance Optimization & Scalability:</strong> Continuously monitor and optimize application performance, database queries, and prepare for scaling.
              </li>
               <li>
                <Settings2 className="inline-block h-5 w-5 mr-2 text-accent align-text-bottom" />
                <strong>CI/CD Pipelines:</strong> Set up Continuous Integration/Continuous Deployment pipelines for automated testing and deployment.
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

    