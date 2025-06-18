
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookUser, FilePlus2, CheckCircle, Settings, AlertCircle, ArrowRight, UploadCloud } from "lucide-react";

export default function UserManualPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BookUser className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">ProcureTrack User Manual</CardTitle>
              <CardDescription>
                A comprehensive guide to using the ProcureTrack application.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">1. Introduction</h2>
            <p>
              Welcome to the ProcureTrack User Manual. This document will guide you through understanding and utilizing all the features of the ProcureTrack application to manage your procurement processes efficiently.
              Content will be updated progressively as new features are developed and existing ones are refined.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">2. Getting Started</h2>
            <p>
              (Details about account creation, login procedures, and initial setup will be added here once user authentication is implemented.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">3. Dashboard Overview</h2>
            <p>
              The dashboard provides a quick overview of key procurement metrics, recent activities, and important alerts. You can filter the displayed statistics by month and year.
              (Detailed explanation of dashboard widgets and their functionalities will be added here.)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground flex items-center"><FilePlus2 className="mr-2 h-6 w-6 text-primary" />4. Creating & Managing Documents</h2>
            <p className="mb-3">The "Create Document" page is your central hub for initiating various procurement and operational records. It features a tabbed interface for different document types.</p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">4.1 Purchase Orders (PO)</h3>
                <p>Used to formalize an order with a supplier.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New PO:</strong> Fill in supplier details, PO information (date, currency, requester), assign an approver, and specify the overall site. Add line items with descriptions, categories, quantities, and unit prices.</li>
                  <li><strong>Load from Requisition:</strong> Select an approved requisition from the dropdown to automatically populate PO items. You can then assign a supplier and finalize PO details.</li>
                  <li><strong>Edit Existing PO:</strong> Enter an existing PO number and click "Load" to populate the form for editing, provided the PO is in 'Draft', 'Pending Approval', or 'Rejected' status.</li>
                  <li><strong>Calculations:</strong> Subtotal, VAT (for MZN currency if not VAT inclusive), and Grand Total are calculated automatically.</li>
                  <li><strong>Submission:</strong> Submitting a PO (typically) moves it to 'Pending Approval' status and assigns it to the selected approver.</li>
                  <li><strong>View/Print:</strong> After saving or loading, you can preview the PO in a printable format or download it as a PDF.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground">4.2 Goods Received Notes (GRN)</h3>
                <p>Used to record the receipt of goods against an approved Purchase Order.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Search PO:</strong> Enter an approved PO number to load its items.</li>
                  <li><strong>Record Quantities:</strong> For each item, enter the quantity being received in the "Receive Now" column. The system shows ordered, previously received, and remaining quantities.</li>
                  <li><strong>Confirm Receipt:</strong> Submitting the GRN (currently simulated) would typically update stock levels and item statuses on the PO.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground">4.3 Client Quotations</h3>
                <p>Used to provide price quotes to clients for goods or services.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New Quote:</strong> Select a client, enter quote details (date, currency), add line items with descriptions, quantities, and unit prices.</li>
                  <li><strong>Edit Existing Quote:</strong> Enter an existing Quote number and click "Load" to populate the form for editing, if it's in 'Draft' or 'Pending Approval' status.</li>
                  <li><strong>Terms & Notes:</strong> Add specific terms and conditions or additional notes for the client.</li>
                  <li><strong>Submission:</strong> Assigning an approver moves the quote to 'Pending Approval'. If no approver is assigned, it's saved as 'Draft'.</li>
                  <li><strong>Preview:</strong> After saving, you can preview the quote in a printable format.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground">4.4 Purchase Requisitions</h3>
                <p>Used for internal requests for goods or services before a PO is created.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New Requisition:</strong> Fill in requestor details, select the site/department, provide justification, and add items with descriptions, categories, quantities, and item-specific sites.</li>
                  <li><strong>Submission:</strong> Assigning an approver moves the requisition to 'Pending Approval'. If no approver is assigned, it's saved as 'Draft'.</li>
                  <li><strong>Preview:</strong> After saving, you can preview the requisition in a printable format.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground">4.5 Fuel Records</h3>
                <p>Used to log fuel consumption for vehicles and equipment.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Record Entry:</strong> Select date, tag (vehicle/equipment), site, enter driver name, odometer reading, fuel quantity, unit cost, and other optional details.</li>
                  <li><strong>Calculations:</strong> Total cost is calculated automatically. Distance travelled between entries for the same tag is also calculated and displayed in the list view.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground flex items-center"><CheckCircle className="mr-2 h-6 w-6 text-primary" />5. My Approvals Page</h2>
            <p>
              The "My Approvals" page lists all documents (Purchase Orders, Client Quotes, Purchase Requisitions) that are assigned to you (based on your login - currently mocked as `pita.domingos@jachris.com`) and are in 'Pending Approval' status.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li><strong>View Details:</strong> Click the "View" button to see a printable preview of the document.</li>
              <li><strong>Approve:</strong> Click "Approve" to change the document's status to 'Approved'.</li>
              <li><strong>Reject:</strong> Click "Reject" to open a dialog where you can optionally provide a reason and change the document's status to 'Rejected'.</li>
              <li><strong>Review (POs only):</strong> For Purchase Orders, click "Review" to open a modal where you can check off specific items and add comments. This (currently simulated) sends feedback to the creator. The PO remains 'Pending Approval'.</li>
              <li><strong>Refresh:</strong> Use the "Refresh List" button to fetch the latest pending items.</li>
            </ul>
             <p className="mt-2 text-sm flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-orange-500" /> If no documents appear, ensure they are set to 'Pending Approval' and correctly assigned to your user account in the system.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" />6. Management Section</h2>
            <p>
              The management section allows administrators to configure and maintain core data entities. Each sub-section typically provides a list view with options to Add, Edit, and Delete records.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-2">
              <li><strong>Sites:</strong> Add, view, edit, and delete company sites/locations. Each site has a name, location, and a site code.</li>
              <li><strong>Suppliers:</strong> Manage vendor information, including contact details, addresses, and NUIT numbers. (CSV Upload available)</li>
              <li><strong>Approvers:</strong> Define users who can approve documents, along with their approval limits.</li>
              <li><strong>Users:</strong> Manage system user accounts, their roles, and active status.</li>
              <li><strong>Categories:</strong> Define categories for items and services used in POs and Requisitions.</li>
              <li><strong>Tags (Vehicles/Equipment):</strong> Manage a list of tagged assets (e.g., vehicles, machinery) with details like make, model, registration, and assigned site. (CSV Upload available)</li>
              <li><strong>Clients:</strong> Manage information for clients to whom quotations are issued. (CSV Upload available)</li>
               <li>
                <span className="flex items-center"><UploadCloud className="h-4 w-4 mr-1 text-primary" /> <strong>CSV Upload:</strong></span> For Clients, Suppliers, and Tags, you can use the "Upload CSV" button to bulk-import data. Download the provided template to ensure correct formatting.
              </li>
              <li><strong>Allocations:</strong> (Legacy) Displays legacy cost allocations/departments. This data is currently read-only. Use "Manage Sites" for current operational locations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">7. Analytics</h2>
            <p>
              Visualize your procurement data with various charts and graphs. Filter data by month and year.
              Current charts include PO Status, Spend by Vendor, PO Count by Category, Users by Role, and Tags by Status. More analytics are planned.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">8. Reports (Future)</h2>
            <p>
              This section will allow generation of detailed reports for in-depth analysis and record-keeping.
              (List of available reports and how to generate them will be added here.)
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">9. Activity Log</h2>
            <p>
             Track system and user activities for auditing and monitoring. The main page shows recent activities, and a dedicated "Activity Log" page provides a more comprehensive view with filtering options.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-foreground">10. Troubleshooting / FAQ</h2>
            <p>
              (Common issues and their solutions, frequently asked questions will be added here.)
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
