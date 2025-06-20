
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Added this import
import { 
  CheckCircle, 
  ListChecks, 
  Zap, 
  DatabaseZap, 
  Users, 
  FileSignature, 
  Fuel, 
  LayoutList, 
  Palette, 
  Settings2, 
  ShieldCheck, 
  BrainCircuit,
  LayoutDashboard,
  Settings,
  BarChart3,
  FileText,
  BookUser,
  FileCode2,
  ClipboardCheck,
  Printer, 
  UserCheck as UserCheckIcon,
  ServerCog, 
  Edit3, 
  ClipboardList as ClipboardListIcon,
  Building,
  UploadCloud,
  Table2,
  Truck,
  Package as PackageIcon,
  Briefcase,
  Tag as TagIcon,
  MessageCircleQuestion,
  ArrowRightLeft,
  Layers,
  Wrench,
  Network,
  Smartphone,
  Globe,
  DollarSign,
  ShieldAlert,
  History
} from "lucide-react";

export default function TodoProgressPage() {
  const completedTasks = [
    { 
      category: "Core Setup & Styling",
      tasks: [
        { icon: Settings2, text: "Initialized Next.js 15 (App Router) project with TypeScript." },
        { icon: Palette, text: "Integrated ShadCN UI components and Tailwind CSS for styling." },
        { icon: Palette, text: "Established a custom theme using HSL CSS variables in `globals.css` for consistent light/dark modes." },
        { icon: Palette, text: "Implemented Light/Dark mode theme toggle functionality in the header." },
      ]
    },
    {
      category: "Application Layout & Navigation",
      tasks: [
        { icon: LayoutList, text: "Developed core application layout: Collapsible Sidebar, Header, and main content area." },
        { icon: LayoutList, text: "Implemented dynamic page titles and breadcrumb navigation in the Header." },
        { icon: UserCheckIcon, text: "Added user avatar display and mock user dropdown in the Header." },
        { icon: Palette, text: "Included a star rating system on most pages for user feedback (mocked interaction)." },
      ]
    },
    {
      category: "Dashboard Module",
      tasks: [
        { icon: LayoutDashboard, text: "Created Dashboard page (`src/app/page.tsx`) as the main overview." },
        { icon: LayoutDashboard, text: "Implemented dynamic grouped stat cards for key metrics (Users, POs, GRN Activity, Requisitions, Fuel, Quotes) fetching data via `/api/dashboard-stats`." },
        { icon: Settings2, text: "Integrated FilterBar for Month/Year filtering on dashboard charts." },
        { icon: BarChart3, text: "Developed interactive charts: Monthly PO Status, Site PO Value Status, Requisitions by Status, Quotes by Status, all fetching live data from respective `/api/charts/*` endpoints." },
        { icon: ListChecks, text: "Added a Recent Activity Log table, fetching limited entries from `/api/activity-log`." },
      ]
    },
    {
      category: "Document Creation & Management (`/create-document`)",
      tasks: [
        { icon: LayoutList, text: "Built a tabbed interface for POs, GRNs, Quotes, Requisitions, and Fuel Records." },
        { icon: FileSignature, text: "Purchase Orders (PO): Comprehensive `POForm` for creation & editing; loading items from approved Requisitions (header site ID from Req applied to PO items); unique PO Number generation; CRUD APIs; `PrintablePO` component & Playwright PDF generation; PO List View with actions." },
        { icon: FileSignature, text: "Client Quotations: `QuoteForm` for creation & editing; unique Quote Number generation; CRUD APIs; `PrintableQuote` component; Quote List View with actions; CSV Upload for quotes." },
        { icon: ClipboardListIcon, text: "Purchase Requisitions: `RequisitionForm` for creation & editing; unique Requisition Number generation; CRUD APIs; `PrintableRequisition` component; Requisition List View with actions." },
        { icon: Truck, text: "Goods Received Notes (GRN): `GRNInterface` UI for PO selection and item quantity input; Backend API (`/api/grn`) for processing GRN submissions (updates POItem quantities and PO status); `PrintableGRN` component." },
        { icon: Fuel, text: "Fuel Records: `FuelRecordForm` UI; Fuel Record List View with distance calculation (currently mock data backed, API exists)." },
      ]
    },
    {
      category: "Approvals Workflow",
      tasks: [
        { icon: UserCheckIcon, text: "Consolidated 'My Approvals' page (`/approvals`) for POs, Quotes, and Requisitions." },
        { icon: ServerCog, text: "Backend APIs to fetch pending items for a (mock) logged-in approver." },
        { icon: Settings2, text: "Implemented approve/reject functionality with API calls for each document type." },
        { icon: Edit3, text: "Developed `RejectDocumentModal` for standardized rejection handling." },
        { icon: Edit3, text: "Created `ReviewPOModal` for item-specific feedback on POs (simulated email notification)." },
      ]
    },
    {
      category: "Data Management (Admin Section)",
      tasks: [
        { icon: Settings, text: "Management hub page (`/management`) with dynamic entity counts and navigation cards." },
        { icon: PackageIcon, text: "Suppliers: Full CRUD functionality with `SupplierForm` and API integration." },
        { icon: Users, text: "Approvers: Full CRUD functionality with `ApproverForm` and API integration." },
        { icon: Users, text: "Users: Full CRUD functionality with `UserForm` and API integration (site access display only)." },
        { icon: Building, text: "Sites: Full CRUD functionality with `SiteForm` and API integration." },
        { icon: Briefcase, text: "Allocations: Legacy read-only page with mock data." },
        { icon: TagIcon, text: "Categories: Full CRUD functionality with `CategoryForm` and API integration." },
        { icon: Fuel, text: "Tags (Vehicles/Equipment): Full CRUD functionality with `TagForm` and API integration." },
        { icon: Briefcase, text: "Clients: Full CRUD functionality with `ClientForm` and API integration." },
        { icon: UploadCloud, text: "CSV Data Upload: Implemented for Clients, Tags, and Suppliers, including downloadable templates." },
      ]
    },
    {
      category: "Supporting Pages & Features",
      tasks: [
        { icon: ListChecks, text: "`ActivityLogPage` (`/activity-log`): Detailed view with filtering, fetching from `/api/activity-log`." },
        { icon: BarChart3, text: "`AnalyticsPage` (`/analytics`): Initial charts and placeholders for future detailed analytics." },
        { icon: FileText, text: "`ReportsPage` (`/reports`): Basic placeholder structure." },
        { icon: MessageCircleQuestion, text: "`SurveyPage` (`/survey`): UI for user feedback collection (submission mocked)." },
        { icon: BookUser, text: "`UserManualPage` (`/user-manual`): Comprehensive user guide generated and refined." },
        { icon: FileCode2, text: "`SystemDocumentationPage` (`/system-documentation`): Technical overview of the application." },
        { icon: ClipboardCheck, text: "`TodoProgressPage` (this page): Tracking development milestones." },
      ]
    },
    {
      category: "Backend & Database",
      tasks: [
        { icon: DatabaseZap, text: "Established MySQL database schema with creation and alteration scripts in `/scripts`." },
        { icon: ServerCog, text: "Developed Node.js backend using Next.js API Routes." },
        { icon: DatabaseZap, text: "Configured database connection pool in `backend/db.js`." },
        { icon: ServerCog, text: "Built comprehensive API endpoints for CRUD operations, chart data, document number generation, and specific actions (approve/reject)." },
        { icon: Printer, text: "Implemented server-side PDF generation for Purchase Orders using Playwright." },
      ]
    },
    {
      category: "User Experience & Error Handling",
      tasks: [
        { icon: Zap, text: "Integrated toast notifications for user feedback on operations." },
        { icon: ShieldAlert, text: "Implemented loading states and error messages for data-fetching components." },
        { icon: Palette, text: "Refined print styles for better document presentation, including sticky footer." },
      ]
    }
  ];

  const upcomingTasks = [
    { 
      category: "User Authentication & Authorization",
      tasks: [
        { icon: ShieldCheck, text: "Implement robust user login system (e.g., Firebase Authentication, NextAuth.js)." },
        { icon: Users, text: "Develop Role-Based Access Control (RBAC) for all features and data (Admin, Creator, Approver, Manager, Viewer)." },
        { icon: Settings2, text: "Create User Profile page for password changes, preferences, and notification settings." },
      ]
    },
    {
      category: "Notifications & Communication",
      tasks: [
        { icon: Zap, text: "Develop real-time in-app notifications for critical events (e.g., new approval requests, document status changes)." },
        { icon: Zap, text: "Implement email notifications for approval requests, rejections, comments, and GRN processing completion." },
      ]
    },
    {
      category: "Data Management & Import/Export",
      tasks: [
        { icon: UploadCloud, text: "Expand CSV/Excel import capabilities to all major entities (POs, Requisitions, Fuel Records) with robust validation, error reporting, and preview features." },
        { icon: UploadCloud, text: "Implement Excel/CSV export functionality for all data tables (POs, Quotes, Requisitions, Fuel Records, Management lists)." },
        { icon: Table2, text: "Implement batch update and delete functionalities in all management tables for efficiency." },
      ]
    },
    {
      category: "GRN Module Enhancements",
      tasks: [
        { icon: Truck, text: "Complete full backend integration for GRN processing: Update POItem quantities, PO status, and log activity in ActivityLog table." },
        { icon: History, text: "Develop GRN document history, search, and detailed view functionalities (Printable GRN already exists)." },
        { icon: ArrowRightLeft, text: "Implement systematic handling of discrepancies (short/over-shipments) and returns to supplier processes." },
        { icon: Layers, text: "Integrate GRN processing with a potential inventory module for stock updates (if inventory module is added)." },
      ]
    },
    {
      category: "Fuel Management Enhancements",
      tasks: [
        { icon: DatabaseZap, text: "Complete full backend CRUD operations for Fuel Records, moving beyond mock data to MySQL persistence." },
        { icon: BarChart3, text: "Implement fuel efficiency calculations (e.g., Liters/100km, Liters/hr) based on odometer/hour meter readings using actual data." },
        { icon: ShieldAlert, text: "Develop alerts for abnormal fuel consumption patterns or discrepancies between odometer and fuel." },
      ]
    },
    {
      category: "Reporting & Analytics",
      tasks: [
        { icon: BarChart3, text: "Fully implement the 'Coming Soon' analytics tabs (GRN detailed analytics, Client Quote conversion funnels, Requisition lifecycle efficiency, detailed Fuel Usage trends)." },
        { icon: Settings2, text: "Create a customizable report builder for users to generate ad-hoc reports with selectable columns, filters, and grouping." },
        { icon: FileText, text: "Enable scheduled report generation and email delivery for key reports." },
        { icon: Printer, text: "Add PDF export functionality for all generated reports and charts." },
      ]
    },
    {
      category: "AI Integration (Genkit)",
      tasks: [
        { icon: BrainCircuit, text: "Explore AI-assisted data entry (e.g., extracting data from uploaded invoices/quotes to pre-fill forms)." },
        { icon: BrainCircuit, text: "Implement smart search or natural language querying for data retrieval (e.g., \"Show me all POs for Site X approved last month\")." },
        { icon: BrainCircuit, text: "Develop predictive analytics (e.g., forecasting spend, identifying potential delays in PO fulfillment)." },
        { icon: BrainCircuit, text: "Add automated summary generation for complex documents or reports (e.g., summarizing a long PO or a set of requisitions)." },
      ]
    },
    {
      category: "Inventory Management Module (Optional Extension)",
      tasks: [
        { icon: Layers, text: "Design and implement features to track stock levels for key items and manage stock movements (receipts, issues, transfers)." },
        { icon: Zap, text: "Link inventory with procurement for automated reordering based on pre-defined minimum stock thresholds." },
        { icon: DollarSign, text: "Add stock valuation methods (e.g., FIFO, Weighted Average) and reporting." },
      ]
    },
    {
      category: "Budgeting & Cost Control",
      tasks: [
        { icon: DollarSign, text: "Allow definition of budgets per site, department, or project for specific categories." },
        { icon: BarChart3, text: "Implement real-time tracking of actual spend (from approved POs) against defined budgets." },
        { icon: ShieldAlert, text: "Configure alerts and notifications for budget overruns or when nearing budget thresholds." },
      ]
    },
    {
      category: "Workflow & Process Customization",
      tasks: [
        { icon: Wrench, text: "Enable administrators to define custom approval workflows (e.g., multi-step approvals, conditional routing based on PO value or category)." },
        { icon: Settings2, text: "Allow customization of document numbering schemes (PO, Quote, Requisition) through admin settings." },
      ]
    },
    {
      category: "Accessibility & User Experience",
      tasks: [
        { icon: Smartphone, text: "Thoroughly optimize all views and interactions for mobile devices and tablets." },
        { icon: Smartphone, text: "Explore Progressive Web App (PWA) capabilities for offline access to key data and enhanced mobile experience." },
        { icon: Globe, text: "Implement internationalization (i18n) to support multiple languages (e.g., Portuguese, English)." },
        { icon: Edit3, text: "Enhance inline editing capabilities in data tables where appropriate for faster data updates." },
      ]
    },
    {
      category: "Integrations",
      tasks: [
        { icon: Network, text: "Develop API integrations to sync procurement data (approved POs, supplier invoices) with common accounting software (e.g., QuickBooks, Xero, Sage)." },
        { icon: Users, text: "Consider a dedicated supplier portal for PO viewing, invoice submission, and updating their company information." },
      ]
    },
    {
      category: "Performance & Scalability",
      tasks: [
        { icon: DatabaseZap, text: "Conduct regular database query optimization and indexing reviews, especially for tables with high read/write frequency." },
        { icon: ServerCog, text: "Monitor and improve API response times under load, implementing caching strategies where beneficial." },
        { icon: LayoutDashboard, text: "Enhance frontend rendering performance, especially for large data lists, by exploring techniques like virtualization or pagination." },
        { icon: Settings2, text: "Perform load testing and define scaling strategies for the database and application servers based on expected user growth." },
      ]
    },
    {
      category: "Security & Auditing",
      tasks: [
        { icon: ShieldCheck, text: "Conduct regular security audits and consider penetration testing." },
        { icon: ShieldCheck, text: "Implement Content Security Policy (CSP) and other web security best practices (e.g., HSTS, XSS protection)." },
        { icon: History, text: "Enhance activity logging for more granular tracking of all data changes (old vs. new values) and critical system events." },
        { icon: ListChecks, text: "Develop a dedicated audit trail search and reporting interface for administrators." },
      ]
    },
    {
      category: "Survey & Feedback Module",
      tasks: [
        { icon: DatabaseZap, text: "Implement backend storage and analysis tools for survey responses to derive actionable insights." },
        { icon: MessageCircleQuestion, text: "Enable conditional survey pop-ups based on user activity (e.g., after completing a certain number of POs) or specific application events." },
      ]
    },
    {
      category: "Testing & Quality Assurance",
      tasks: [
        { icon: ClipboardCheck, text: "Establish comprehensive automated testing: unit tests for critical functions, integration tests for API endpoints, and end-to-end tests for key user workflows." },
        { icon: ListChecks, text: "Set up a CI/CD pipeline for automated testing and deployment." },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Application To-Do List & Progress</CardTitle>
              <CardDescription>
                Tracking our journey in building the ProcureTrack application. This includes completed milestones, current work, and future enhancements.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {completedTasks.map((categoryItem, catIndex) => (
            <section key={`completed-cat-${catIndex}`}>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                {categoryItem.category}
              </h2>
              <ul className="list-none space-y-2 pl-0">
                {categoryItem.tasks.map((task, taskIndex) => (
                  <li key={`completed-task-${catIndex}-${taskIndex}`} className="flex items-start p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <task.icon className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{task.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <Separator className="my-8" />

          {upcomingTasks.map((categoryItem, catIndex) => (
             <section key={`upcoming-cat-${catIndex}`}>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <ListChecks className="h-6 w-6 mr-2 text-accent" />
                Future Enhancements: {categoryItem.category}
              </h2>
              <ul className="list-none space-y-2 pl-0">
                {categoryItem.tasks.map((task, taskIndex) => (
                  <li key={`upcoming-task-${catIndex}-${taskIndex}`} className="flex items-start p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <task.icon className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{task.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          
          <section>
            <p className="text-sm text-muted-foreground italic mt-8">
              <strong>Note on Development:</strong> This list tracks planned features and improvements. Implementation priority and timelines are subject to change based on evolving requirements and resource availability.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
