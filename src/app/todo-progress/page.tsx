
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ListChecks, Zap, DatabaseZap, Users, FileSignature, Fuel, LayoutList, Palette, Settings2, ShieldCheck, BrainCircuit } from "lucide-react";

export default function TodoProgressPage() {
  const completedTasks = [
    { icon: Settings2, text: "Initial Next.js 15 (App Router) & TypeScript setup." },
    { icon: Palette, text: "UI Framework: ShadCN UI components & Tailwind CSS integration." },
    { icon: LayoutList, text: "Core App Layout: Collapsible sidebar, header, theme provider." },
    { icon: Palette, text: "Dark Mode & Light Mode theme toggle functionality." },
    { icon: LayoutDashboard, text: "Dashboard Page: Stat cards, placeholder charts for PO status and allocations." },
    { icon: FileSignature, text: "Create Document Page: Tabbed interface for PO, GRN, Quote (placeholder), Fuel (placeholder)." },
    { icon: FileSignature, text: "Purchase Order (PO) Form: Detailed form with item array, calculations, supplier selection." },
    { icon: Users, text: "Goods Received Note (GRN) Interface: PO search and item receiving simulation." },
    { icon: Settings, text: "Management Section Hub: Links to individual entity management pages." },
    { icon: Users, text: "Placeholder Management Pages: For Approvers, Users, Sites, Allocations, Categories with mock data tables." },
    { icon: ListChecks, text: "Activity Log Page: Displaying mock activity data." },
    { icon: BarChart3, text: "Analytics Page: Charts for Spend by Vendor, PO Count by Category, and placeholders for Quote/Fuel." },
    { icon: FileText, text: "Reports Page: Placeholder for future reporting features." },
    { icon: BookUser, text: "User Manual Page: Structure for application user guide." },
    { icon: FileCode, text: "System Documentation Page: Structure including architecture overview & key files list." },
  ];

  const upcomingTasks = [
    { icon: DatabaseZap, text: "Full Backend Integration: Connect forms and tables to the MySQL database via Express API for all CRUD operations (Suppliers, POs, Users, Sites, etc.)." },
    { icon: FileSignature, text: "Complete GRN Functionality: Actual item receipt processing, stock updates, back-order handling." },
    { icon: FileSignature, text: "Build 'Create Quotation' Form & Workflow: Allow users to generate and manage supplier quotations." },
    { icon: Fuel, text: "Implement 'Record Fuel' Form & Logic: Track fuel consumption, vehicle mileage, and inventory." },
    { icon: FileText, text: "Develop Report Generation: Create dynamic reports based on system data (PO status, spend, vendor performance)." },
    { icon: ShieldCheck, text: "User Authentication & Authorization: Implement login, user roles, and permissions." },
    { icon: BrainCircuit, text: "Integrate Genkit for AI Features: Explore AI-assisted form filling, data analysis, or report summaries." },
    { icon: Zap, text: "Real-time Notifications: For PO approvals, new assignments, etc." },
    { icon: DatabaseZap, text: "Data Upload Functionality: Implement CSV/Excel uploads for suppliers, POs, etc. via backend routes." },
    { icon: Users, text: "User Profile & Settings Page: Allow users to manage their preferences." },
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
