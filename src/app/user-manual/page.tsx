
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookUser, Info, Palette, LayoutDashboard, FilePlus2, ShoppingCart, FileText, ClipboardList,
  Truck, Fuel, UserCheck, ListChecks, BarChart3, Settings, Package, Users, Building,
  Tag as TagLucideIcon, Briefcase, MessageCircleQuestion, ClipboardCheck, FileCode2, ArrowRight,
  ShieldCheck, HelpCircle, Printer, UploadCloud, Edit2, Trash2, Save, Eye, AlertTriangle, Search, Mail
} from "lucide-react"; // Added all icons used

export default function UserManualPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <BookUser className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">ProcureTrack User Manual</CardTitle>
              <CardDescription className="text-md">
                Your comprehensive guide to navigating and utilizing the ProcureTrack application.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-10 text-muted-foreground text-sm leading-relaxed">
          
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <Info className="mr-2 h-6 w-6 text-primary" />1. Introduction
            </h2>
            <p>
              Welcome to ProcureTrack! This application is designed to streamline and manage your organization's procurement processes, from initial requisitions to purchase orders, goods receiving, client quotations, and fuel record management. This manual will guide you through its features and functionalities.
            </p>
            <div className="mt-3 p-3 border-l-4 border-primary bg-primary/10 rounded-r-md">
              <h4 className="font-medium text-primary mb-1">How to use this manual:</h4>
              <p className="text-xs">
                Use the table of contents (if available on the platform) or scroll through the sections. Click on the links in the Table of Contents <ArrowRight className="inline h-3 w-3" /> to jump to specific sections. Look for icons next to section titles for a quick visual cue about the content.
              </p>
            </div>
          </section>

          <section id="getting-started">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <Palette className="mr-2 h-6 w-6 text-primary" />2. Getting Started
            </h2>
            <p>
              Currently, ProcureTrack uses a mock authentication system for demonstration (e.g., the "My Approvals" page is hardcoded for a specific approver email). Full user authentication, login, and role-based access control are planned future enhancements.
            </p>
            <p className="mt-2">
              <strong>Theme Customization:</strong> You can switch between Light, Dark, and System default themes using the sun/moon icon in the top header bar.
            </p>
             <p className="mt-2">
              <strong>Page Rating:</strong> Most pages feature a star rating system in the header. Your feedback helps us understand page usefulness and identify areas for improvement.
            </p>
          </section>

          <section id="dashboard">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <LayoutDashboard className="mr-2 h-6 w-6 text-primary" />3. Dashboard Overview
            </h2>
            <p>
              The Dashboard (Home page) provides a high-level overview of key procurement metrics and recent activities. It features:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><strong>Grouped Stat Cards:</strong> Summarizing counts for Users, Purchase Orders (POs), Goods Received Note (GRN) activity, Requisitions, Fuel Management, and Client Quotations. Click "View Details" to navigate to relevant management or creation pages.</li>
              <li><strong>Interactive Charts:</strong> Visualizing data such as Monthly PO Status, PO Value by Site, Requisitions by Status, and Quotes by Status.</li>
              <li><strong>Recent Activity Log:</strong> A snapshot of the latest system activities.</li>
              <li><strong>Filters:</strong> Date filters (Month/Year) at the top allow you to refine the data displayed on the dashboard charts and potentially for some stat cards.</li>
            </ul>
          </section>

          <section id="create-document">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <FilePlus2 className="mr-2 h-6 w-6 text-primary" />4. Creating & Managing Documents
            </h2>
            <p>
              The "Create Document" page is your hub for initiating and managing various procurement-related documents. It uses a tabbed interface to switch between different document types. Each document type typically has a form for creation/editing and a list view of existing documents.
            </p>

            <div className="ml-4 mt-4 space-y-6">
              <h3 className="text-xl font-medium text-foreground flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-primary" />4.1 Purchase Orders (PO)
              </h3>
              <p>
                Create, edit, and manage Purchase Orders to send to your suppliers.
              </p>
              <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                <li><strong>Creating a New PO:</strong>
                  <ul className="list-['-_'] list-inside ml-6">
                    <li>Navigate to "Create Document" <ArrowRight className="inline h-3 w-3" /> "Purchase Orders" tab <ArrowRight className="inline h-3 w-3" /> "Create New PO" tab.</li>
                    <li>A new PO number will be suggested (e.g., PO-000XX).</li>
                    <li><strong>Load from Requisition (Optional):</strong> Select an 'Approved' requisition from the dropdown to automatically populate requester information and items. Item sites on the PO will default to the Requisition's header site.</li>
                    <li>Fill in PO Date, select Supplier, add Quote No. (optional), and select Currency.</li>
                    <li>Enter "Requested By Name" (free text for who requested the items/services).</li>
                    <li>Assign an "Approver". If an approver is selected, the PO will be submitted as 'Pending Approval'. If no approver is selected, it will be saved as 'Draft'.</li>
                    <li>Item-level Site: Each line item must have a "Site" assigned for cost allocation.</li>
                    <li>Add items with Part Number (optional), Description, Category, UOM, Quantity, and Unit Price.</li>
                    <li>Check "Prices VAT inclusive" if applicable (VAT calculation is specific to MZN currency).</li>
                    <li>Add any "Notes" for the PO.</li>
                    <li>Click "Submit PO" (if approver selected) or "Save as Draft / Update PO" and then "View/Print PO".</li>
                  </ul>
                </li>
                <li><strong>Editing a PO:</strong>
                  <ul className="list-['-_'] list-inside ml-6">
                    <li>From the "List of POs" tab, click the <Edit2 className="inline h-3 w-3" /> icon next to a PO. This takes you to the PO form with its details pre-filled.</li>
                    <li>Alternatively, on the PO form, type an existing PO number (that is 'Draft', 'Pending Approval', or 'Rejected') into the "PO Number" field and click "Load".</li>
                    <li>Modify details as needed. POs can only be edited if their status is 'Draft', 'Pending Approval', or 'Rejected'.</li>
                    <li>Save changes. If the PO was 'Rejected' and an approver is now assigned, its status will change to 'Pending Approval'.</li>
                  </ul>
                </li>
                <li><strong>Viewing/Printing a PO:</strong>
                  <ul className="list-['-_'] list-inside ml-6">
                    <li>After saving, or from the list view (<Eye className="inline h-3 w-3" /> icon), you'll be taken to the print preview page.</li>
                    <li>Use the <Printer className="inline h-3 w-3" /> "Print PO" button for a physical copy or "Save as PDF".</li>
                    <li>A "Download PDF" button is available for server-side PDF generation.</li>
                  </ul>
                </li>
                <li><strong>Deleting a PO:</strong> POs in 'Draft' or 'Rejected' status can be deleted from the "List of POs" using the <Trash2 className="inline h-3 w-3" /> icon.</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mt-6 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />4.2 Client Quotations
              </h3>
              <p>
                Create and manage quotations for your clients.
              </p>
              <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                <li><strong>Creating a New Quote:</strong>
                  <ul className="list-['-_'] list-inside ml-6">
                    <li>Navigate to "Create Document" <ArrowRight className="inline h-3 w-3" /> "Client Quotes" tab <ArrowRight className="inline h-3 w-3" /> "Create New Quote" tab.</li>
                    <li>A new Quote number will be suggested.</li>
                    <li>Select Client, Quote Date, and Currency.</li>
                    <li>Add items with Part Number (optional), Customer Ref (optional), Description, Quantity, and Unit Price.</li>
                    <li>Enter Terms & Conditions and any Notes for the client.</li>
                    <li>Assign an "Approver" (optional). If assigned, the quote status becomes 'Pending Approval'; otherwise, it's 'Draft'.</li>
                    <li>Click "Save & Preview Quote".</li>
                  </ul>
                </li>
                <li><strong>Editing a Quote:</strong> Similar to POs, editable if 'Draft' or 'Pending Approval'. Load via list view (<Edit2 className="inline h-3 w-3" />) or by typing number and clicking "Load".</li>
                <li><strong>Viewing/Printing a Quote:</strong> Via list view (<Eye className="inline h-3 w-3" />) or after saving. Print options available.</li>
                <li><strong>CSV Upload:</strong> Upload client quotes in bulk using the <UploadCloud className="inline h-3 w-3" /> "Upload CSV" button on the "List of Quotes" tab. A template is available for download.</li>
                <li><strong>Deleting a Quote:</strong> Quotes in 'Draft' or 'Rejected' status can be deleted from the list view (<Trash2 className="inline h-3 w-3" />).</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mt-6 flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-primary" />4.3 Purchase Requisitions
              </h3>
              <p>
                Create internal requests for goods or services. Approved requisitions can be used to pre-fill Purchase Orders.
              </p>
              <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                <li><strong>Creating a New Requisition:</strong>
                  <ul className="list-['-_'] list-inside ml-6">
                    <li>Navigate to "Create Document" <ArrowRight className="inline h-3 w-3" /> "Requisitions" tab <ArrowRight className="inline h-3 w-3" /> "Create New Requisition" tab.</li>
                    <li>A new Requisition number will be suggested.</li>
                    <li>Select Date, Requested By (user), and Site/Department (header level).</li>
                    <li>Add items: Part Number (optional), Description, Category, Quantity, and Item-Specific Justification.</li>
                    <li>Assign an "Approver" (optional). If assigned, status becomes 'Pending Approval'; otherwise, 'Draft'.</li>
                    <li>Click "Save & Preview Requisition".</li>
                  </ul>
                </li>
                <li><strong>Editing a Requisition:</strong> Editable if 'Draft', 'Pending Approval', or 'Rejected'. Load via list view (<Edit2 className="inline h-3 w-3" />) or "Load" button.</li>
                <li><strong>Viewing/Printing a Requisition:</strong> Via list view (<Eye className="inline h-3 w-3" />) or after saving.</li>
                 <li><strong>Deleting a Requisition:</strong> Requisitions in 'Draft' or 'Rejected' status can be deleted from the list view (<Trash2 className="inline h-3 w-3" />).</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mt-6 flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />4.4 Goods Received Notes (GRN)
              </h3>
              <p>
                Record the receipt of goods against approved Purchase Orders.
              </p>
              <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                <li>Navigate to "Create Document" <ArrowRight className="inline h-3 w-3" /> "GRNs" tab.</li>
                <li>Select an approved Purchase Order from the dropdown. PO details and items will load.</li>
                <li>Enter the GRN Date and Supplier Delivery Note No. (optional).</li>
                <li>For each item, enter the "Receive Now" quantity. You can use the "All" button to quickly fill in the full outstanding quantity for an item. Add any item-specific notes (e.g., batch number).</li>
                <li>Add any "Overall GRN Notes" for the entire delivery.</li>
                <li>Click "Confirm Receipt". This action is currently simulated and will show a printable GRN. Full backend processing (updating PO item quantities and statuses) is pending.</li>
                <li>After confirmation, you can print the GRN or create a new one.</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mt-6 flex items-center">
                <Fuel className="mr-2 h-5 w-5 text-primary" />4.5 Fuel Records
              </h3>
              <p>
                Log fuel consumption for vehicles and equipment (Tags).
              </p>
              <ul className="list-disc list-inside ml-4 text-xs space-y-1">
                 <li>Navigate to "Create Document" <ArrowRight className="inline h-3 w-3" /> "Fuel Records" tab <ArrowRight className="inline h-3 w-3" /> "Record New Fuel Entry" tab.</li>
                <li>Fill in Date, select Tag (Vehicle/Equipment), Site, Driver, Odometer (if applicable), Requisition No. (optional), Invoice No. (optional), Description (e.g., Diesel), UOM, Quantity, and Unit Cost.</li>
                <li>The Total Cost is calculated automatically.</li>
                <li>Click "Save Fuel Record". (Currently saves to mock data).</li>
                <li>The "List of Fuel Records" tab shows logged entries, calculating distance travelled between entries for the same tag.</li>
              </ul>
            </div>
          </section>

          <section id="approvals">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <UserCheck className="mr-2 h-6 w-6 text-primary" />5. My Approvals
            </h2>
            <p>
              The "My Approvals" page lists all documents (POs, Quotes, Requisitions) assigned to you that are in 'Pending Approval' status.
              (Currently hardcoded for user: 'pita.domingos@jachris.com').
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-xs">
              <li><strong>Viewing Items:</strong> See a table of pending documents with key details.</li>
              <li><strong>Actions:</strong>
                <ul className="list-['-_'] list-inside ml-6">
                  <li><Eye className="inline h-3 w-3" /> <strong>View:</strong> Opens the print preview page for the document.</li>
                  <li><UserCheck className="inline h-3 w-3" /> <strong>Approve:</strong> Approves the document. Its status will change to 'Approved'.</li>
                  <li><AlertTriangle className="inline h-3 w-3" /> <strong>Reject:</strong> Opens a dialog to reject the document. You can optionally provide a reason (not yet stored for all document types).</li>
                  <li><Mail className="inline h-3 w-3" /> <strong>Review (POs only):</strong> Opens a "Review PO Modal" where you can check specific items and add comments. Submitting feedback (simulated) sends comments to the creator; the PO remains 'Pending Approval'.</li>
                </ul>
              </li>
              <li><strong>Refresh:</strong> Use the "Refresh List" button to fetch the latest pending items.</li>
            </ul>
          </section>

          <section id="activity-log">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-primary" />6. Activity Log
            </h2>
            <p>
              The "Activity Log" page displays a log of system and user activities. You can filter the log by:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-xs">
              <li><strong>Month and Year:</strong> Select from dropdowns.</li>
              <li><strong>User:</strong> Type part of a user's name to filter.</li>
              <li><strong>Action:</strong> Type part of an action description to filter.</li>
            </ul>
            <p className="mt-1 text-xs">The table shows User, Action, Timestamp, and Details for each activity.</p>
          </section>

          <section id="analytics">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-primary" />7. Analytics
            </h2>
            <p>
              The "Analytics" page provides visual insights into your procurement data. It includes:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-xs">
              <li><strong>Filters:</strong> Date filters (Month/Year) apply to the charts on this page.</li>
              <li><strong>PO Analytics (Tab):</strong>
                <ul className="list-['-_'] list-inside ml-6">
                    <li><strong>Spend by Vendor Chart:</strong> Visualizes total PO value per vendor.</li>
                    <li><strong>PO Count by Category Chart:</strong> Shows the number of POs for each item/service category.</li>
                </ul>
              </li>
              <li><strong>GRN Analytics, Client Quotes, Requisitions, Fuel Usage (Tabs):</strong> These sections currently display "Coming Soon!" placeholders with suggestions for potential analytics to be developed.</li>
            </ul>
          </section>

          <section id="reports">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />8. Reports
            </h2>
            <p>
              The "Reports" page is a placeholder for future reporting functionalities. This section will allow users to generate detailed reports on various aspects of the procurement process, such as PO statuses, vendor performance, spend analysis, and more.
            </p>
          </section>

          <section id="management">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <Settings className="mr-2 h-6 w-6 text-primary" />9. Management
            </h2>
            <p>
              The "Management" section allows administrators to manage core data entities within the application. Each sub-section provides a list view and options to Add, Edit, and Delete records.
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2 text-xs">
              <li><Package className="inline h-3 w-3 mr-1" /><strong>Suppliers:</strong> Manage vendor information (code, name, contact details, etc.). CSV upload available.</li>
              <li><Users className="inline h-3 w-3 mr-1" /><strong>Approvers:</strong> Manage users who can approve documents (POs, Quotes, Requisitions), including their approval limits.</li>
              <li><Users className="inline h-3 w-3 mr-1" /><strong>Users:</strong> Manage system user accounts, roles, and active status. Site access display is informational; direct management of site access per user is a future feature.</li>
              <li><Building className="inline h-3 w-3 mr-1" /><strong>Sites:</strong> Manage company sites, locations, or departments used for cost allocation and assignments.</li>
              <li><Briefcase className="inline h-3 w-3 mr-1" /><strong>Allocations:</strong> (Legacy) View pre-defined cost allocations. This is read-only and primarily for historical reference. Use "Sites" for current location management.</li>
              <li><TagLucideIcon className="inline h-3 w-3 mr-1" /><strong>Categories:</strong> Manage categories for items and services used in POs and Requisitions.</li>
              <li><Fuel className="inline h-3 w-3 mr-1" /><strong>Tags (Vehicles/Equipment):</strong> Manage vehicles, machinery, or other tagged assets, including their status and assigned site. CSV upload available.</li>
              <li><Briefcase className="inline h-3 w-3 mr-1" /><strong>Clients:</strong> Manage information for clients for whom quotations are generated. CSV upload available.</li>
            </ul>
             <p className="mt-2 text-xs">
                For entities supporting CSV upload (Suppliers, Tags, Clients), a "Download Template" link is provided on their respective management pages.
              </p>
          </section>

          <section id="feedback-survey">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <MessageCircleQuestion className="mr-2 h-6 w-6 text-primary" />10. Feedback Survey
            </h2>
            <p>
              The "Feedback Survey" page allows you to provide valuable input on your experience using ProcureTrack. Please answer the questions regarding ease of use, feature satisfaction, responsiveness, and suggestions for improvement.
            </p>
            <p className="mt-1 text-xs">
              Currently, submissions are logged to the console (simulated). Backend storage and analysis of survey data are planned.
            </p>
          </section>
          
          <section id="todo-progress">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <ClipboardCheck className="mr-2 h-6 w-6 text-primary" />11. To-Do / Progress
            </h2>
            <p>
              This page provides a list of completed milestones and upcoming features/enhancements for the ProcureTrack application, offering transparency on the development roadmap.
            </p>
          </section>

          <section id="system-documentation">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <FileCode2 className="mr-2 h-6 w-6 text-primary" />12. System Documentation
            </h2>
            <p>
              This page contains an overview of the application's architecture, key technologies used, database schema information, styling guidelines, a list of key files/directories, descriptions of core workflows, and notes on security considerations and future enhancements. It's primarily for developers or those interested in the technical aspects of ProcureTrack.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center">
              <HelpCircle className="mr-2 h-6 w-6 text-primary" />13. Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-medium text-foreground">Q: How do I create a new Purchase Order?</h4>
                <p>A: Navigate to "Create Document" from the sidebar, select the "Purchase Orders" tab, then the "Create New PO" tab. Fill in the required details and add items. See section 4.1 for more details.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How can I edit an existing Purchase Order?</h4>
                <p>A: You can edit a PO if its status is 'Draft', 'Pending Approval', or 'Rejected'. Go to the "List of POs" tab under "Create Document" <ArrowRight className="inline h-3 w-3" /> "Purchase Orders", and click the <Edit2 className="inline h-3 w-3" /> icon. Alternatively, on the PO form, type the PO number and click "Load".</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Where do I approve documents assigned to me?</h4>
                <p>A: Go to the "My Approvals" page from the sidebar. This page lists all POs, Quotes, and Requisitions pending your approval. (Currently hardcoded for a specific demo user).</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Can I load items from a Requisition into a Purchase Order?</h4>
                <p>A: Yes. When creating a new PO, you can select an 'Approved' requisition from the "Load from Approved Requisition" dropdown. This will populate the requester details and items from that requisition. Each PO item's site will default to the Requisition's header site.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How do I record received goods (GRN)?</h4>
                <p>A: Go to "Create Document" <ArrowRight className="inline h-3 w-3" /> "GRNs" tab. Select an approved PO, then enter the quantities received for each item. The backend processing for GRNs (updating PO item quantities/statuses) is currently simulated after confirmation.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How do I manage suppliers, users, sites, etc.?</h4>
                <p>A: Use the "Management" section. Each sub-page (e.g., Suppliers, Users, Sites) allows you to view, add, edit, and delete records. Some sections, like Clients, Tags, and Suppliers, also support CSV data upload.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How do I change the application's theme (Light/Dark mode)?</h4>
                <p>A: Click the sun/moon icon in the top header bar to cycle through Light, Dark, and System default themes.</p>
              </div>
               <div>
                <h4 className="font-medium text-foreground">Q: Why can't I edit a Purchase Order/Quote/Requisition?</h4>
                <p>A: Documents can typically only be edited if their status is 'Draft', 'Pending Approval', or 'Rejected'. Approved or Completed documents are usually locked to maintain data integrity. Check the document's status on its list view or print preview.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: The "My Approvals" page is empty or not showing items for me. Why?</h4>
                <p>A: Currently, the "My Approvals" page is hardcoded for a demo user ('pita.domingos@jachris.com'). For other users, it will appear empty. Full user-specific approval queues will be implemented with the authentication system.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Where are the PDF versions of documents stored?</h4>
                <p>A: For Purchase Orders, a "Download PDF" button on the print preview page triggers server-side PDF generation. The PDF is generated on-the-fly and downloaded to your computer; it's not stored permanently on the server in this version. PDF generation for other document types is a planned feature.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How does the page rating system work?</h4>
                <p>A: The star rating in the header of most pages allows you to provide quick feedback on the page's usefulness. Clicking the stars submits your rating (currently mocked). This helps us improve the application.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: What if I find an error or have a feature request?</h4>
                <p>A: Please use the "Feedback Survey" page to provide detailed feedback or suggestions. For critical errors, contact the system administrator or development team if applicable.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Why is some data (e.g., Fuel Records, GRN item updates) not persisting permanently?</h4>
                <p>A: Some modules like Fuel Records currently use mock data or simulated saving for demonstration. Full backend database integration for all functionalities is ongoing. Always refer to the "To-Do / Progress" page for the latest development status.</p>
              </div>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}

    