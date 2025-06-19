
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  UserCheck, 
  ServerCog, 
  Edit3, 
  ClipboardList,
  Building,
  UploadCloud,
  Table2,
  Truck,
  Package,
  Briefcase,
  TagIcon as TagLucideIcon,
  MessageCircleQuestion,
  ArrowRightLeft,
  Layers
} from "lucide-react";

export default function TodoProgressPage() {
  const completedTasks = [
    { icon: Settings2, text: "Initial Next.js 15 (App Router) & TypeScript setup." },
    { icon: Palette, text: "UI Framework: ShadCN UI components & Tailwind CSS integration." },
    { icon: LayoutList, text: "Core App Layout: Collapsible sidebar, header, theme provider, star rating in header." },
    { icon: Palette, text: "Dark Mode & Light Mode theme toggle functionality." },
    { icon: LayoutDashboard, text: "Dashboard Page: Dynamic stat cards, charts for Monthly PO Status, Site PO Value, Users by Role, Tags by Status. Data fetched via API." },
    { icon: FileSignature, text: "Create Document Page: Tabbed interface for PO, GRN, Quote, Requisition, Fuel." },
    { 
      icon: FileSignature, 
      text: "Purchase Order (PO) Module: Detailed PO Form (creation & editing, including loading items from approved Requisitions), PO API for CRUD & next PO number, Print Preview & PDF Generation." 
    },
    {
      icon: FileSignature,
      text: "Client Quotation Module: Quote Form (creation & editing), Quote API for CRUD & next quote number, Print Preview."
    },
    {
      icon: ClipboardList,
      text: "Purchase Requisition Module: Requisition Form (creation & editing), Requisition API for CRUD & next requisition number, Print Preview."
    },
    { 
      icon: UserCheck, 
      text: "Approvals Workflow: Consolidated 'My Approvals' Page for POs, Quotes, & Requisitions. API endpoints for fetching pending items and processing approvals/rejections. Review PO Modal for item feedback." 
    },
    { icon: Truck, text: "Goods Received Note (GRN) Interface: PO search and item receiving UI simulation (full backend update pending)." },
    { icon: Fuel, text: "Fuel Record Module: Fuel Record Form & List view with distance calculation, mock data for now." },
    { 
      icon: Settings, 
      text: "Management Section & CRUD APIs: Hub page. Full CRUD operations for Sites, Suppliers, Approvers, Users, Categories, Tags, Clients with backend API integration." 
    },
    {
      icon: UploadCloud,
      text: "CSV Data Upload: Implemented for Clients, Tags, and Suppliers, including downloadable templates."
    },
    { 
      icon: DatabaseZap, 
      text: "Database Schema: Initial setup and various alteration scripts executed (e.g., RequisitionItem.siteId added, estimatedUnitPrice dropped, PO approverId logic updated)." 
    },
    { icon: ListChecks, text: "Activity Log Page: Displaying mock activity data, full logging pending." },
    { icon: BarChart3, text: "Analytics Page: Charts for Spend by Vendor, PO by Category, Users by Role, Tags by Status. Detailed 'Coming Soon' suggestions added for GRN, Quote, Requisition, Fuel tabs." },
    { icon: FileText, text: "Reports Page: Placeholder structure for future reporting features." },
    { icon: BookUser, text: "User Manual: Detailed content for core features like Document Creation, Approvals, Management." },
    { icon: FileCode2, text: "System Documentation: Comprehensive overview of architecture, technologies, key files, and future roadmap." },
    { icon: MessageCircleQuestion, text: "Feedback Survey Page: UI for user feedback collection (backend submission pending)." },
    { icon: ClipboardCheck, text: "This To-Do/Progress page for tracking development." },
  ];

  const upcomingTasks = [
    { icon: ShieldCheck, text: "User Authentication & Authorization: Implement robust login, user roles (Admin, Creator, Approver, etc.), and permission-based access control for all features and data." },
    { icon: Truck, text: "Complete GRN Functionality: Actual item receipt processing in the database (update POItem statuses & quantityReceived), GRN document generation/history." },
    { icon: DatabaseZap, text: "Complete Backend for Fuel Records: Ensure robust saving and retrieval of fuel records from the database, beyond mock data." },
    { icon: FileText, text: "Develop Reporting Module: Create dynamic reports (PO status, spend, vendor performance, GRN summaries, Fuel usage etc.) with filtering and export options (Excel, PDF)." },
    { icon: Zap, text: "Real-time Notifications: In-app or email notifications for approvals, status changes, comments." },
    { icon: BrainCircuit, text: "Integrate Genkit for AI Features: Explore AI-assisted form filling, data analysis, or report summaries." },
    { icon: Settings2, text: "User Profile & Settings Page: Allow users to manage their profile, preferences, and notification settings." },
    { icon: Layers, text: "Inventory Management Module (Potential): If required, add functionality to track inventory levels, manage stock movements, and link with procurement." },
    { icon: ArrowRightLeft, text: "Advanced GRN Features: Handling of partial receipts, back-orders, and returns more explicitly." },
    { icon: UploadCloud, text: "CSV Data Upload Expansion: Implement for POs, Requisitions, and Fuel Records." },
    { icon: ListChecks, text: "Enhanced Activity Logging: More detailed and searchable activity logs integrated with backend actions." },
    { icon: MessageCircleQuestion, text: "Survey Pop-up Logic: Implement triggers for displaying the feedback survey based on user activity or specific events." },
    { icon: BarChart3, text: "Advanced Analytics Dashboards: Implement the suggested 'Coming Soon' analytics for GRN, Quotes, Requisitions, and Fuel tabs." },
    { icon: ClipboardCheck, text: "Automated Testing: Implement unit, integration, and end-to-end tests." },
    { icon: Zap, text: "Performance Optimization: Continuous monitoring and optimization of database queries, API response times, and frontend rendering." },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Application To-Do List & Progress</CardTitle>
              <CardDescription>
                Tracking our journey in building the ProcureTrack application.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Completed Milestones
            </h2>
            <ul className="list-none space-y-2 pl-0">
              {completedTasks.map((task, index) => (
                <li key={`completed-${index}`} className="flex items-start p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <task.icon className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{task.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <ListChecks className="h-6 w-6 mr-2 text-accent" />
              Next Steps & Future Enhancements
            </h2>
            <ul className="list-none space-y-2 pl-0">
              {upcomingTasks.map((task, index) => (
                <li key={`upcoming-${index}`} className="flex items-start p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <task.icon className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                   <span className="text-muted-foreground">{task.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-sm text-muted-foreground italic">
              <strong>Note on Time Estimates:</strong> While this list helps track feature development, providing precise time estimates for software development tasks is complex and depends on various factors. This page focuses on outlining completed and planned features.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

