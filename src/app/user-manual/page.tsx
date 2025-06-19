
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookUser, FilePlus2, CheckCircle, Settings, AlertCircle, ArrowRight, UploadCloud, LayoutDashboard,
  BarChart3, ListChecks as ListChecksIcon, Printer, HelpCircle, Fuel, Truck, FileSignature,
  ClipboardList, Tag as TagLucideIcon, Package as PackageIcon, Users, Building, CaseSensitive, Edit2, Eye, Trash2, Edit, Palette, Info, FileCode2, Workflow, ShoppingCart
} from "lucide-react";

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
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><Info className="mr-2 h-6 w-6 text-primary" />1. Introduction</h2>
            <p>
              Welcome to ProcureTrack! This application is designed to streamline and manage your organization's procurement processes, from initial requisitions to purchase orders, goods receiving, client quotations, and fuel record management. This manual will guide you through its features and functionalities.
            </p>
          </section>

          <section id="getting-started">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" />2. Getting Started</h2>
            <p>
              Currently, ProcureTrack uses a mock authentication system (e.g., the "My Approvals" page is hardcoded for 'pita.domingos@jachris.com'). Full user authentication, login, and role-based access control are planned future enhancements.
            </p>
            <p className="mt-2">
              <strong>Theme Customization:</strong> You can switch between Light, Dark, and System default themes using the sun/moon icon in the top header bar.
            </p>
             <p className="mt-2">
              <strong>Page Rating:</strong> Most pages feature a star rating system in the header. Your feedback helps us understand page usefulness and identify areas for improvement.
            </p>
          </section>

          <section id="dashboard">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><LayoutDashboard className="mr-2 h-6 w-6 text-primary" />3. Dashboard Overview</h2>
            <p>
              The Dashboard (Home page) provides a snapshot of key procurement metrics and recent activities. It features:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><strong>Filter Bar:</strong> Allows filtering of dashboard statistics by month and year.</li>
              <li><strong>Statistic Cards:</strong> Display summarized counts for Users, Purchase Orders, Goods Received, Requisitions, Fuel Management, and Client Quotes.</li>
              <li><strong>Charts:</strong> Visual representations of Monthly PO Status, PO Value by Site & Status, Requisitions by Status, and Quotes by Status.</li>
              <li><strong>Recent Activity Log:</strong> Shows the latest 20 system and user activities fetched from the database.</li>
              <li><strong>Refresh Data:</strong> A button to manually refresh all dashboard data.</li>
            </ul>
          </section>

          <section id="create-document">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><FilePlus2 className="mr-2 h-6 w-6 text-primary" />4. Creating & Managing Documents</h2>
            <p className="mb-3">The "Create Document" page is your central hub for initiating various procurement and operational records. It features a tabbed interface for different document types. Each document type also has a "List View" tab to see existing documents, apply filters, and perform actions like View, Edit, or Delete (depending on document status and user permissions).</p>
            
            <div className="ml-4 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><ShoppingCart className="mr-2 h-5 w-5 text-primary" />4.1 Purchase Orders (PO)</h3>
                <p>Formalize orders with suppliers. Accessible via "Create Document" &rarr; "Purchase Orders" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New PO:</strong>
                    <ul className="list-['-_'] list-inside ml-6">
                      <li>Fill supplier details (or select existing), PO information (date, currency, requester name), assign an approver. The overall PO header site is not used from this form; site is specified per item.</li>
                      <li>Add line items: part number, description, category, specific site for the item, UOM, quantity, and unit price.</li>
                      <li>Totals (Subtotal, VAT, Grand Total) are calculated automatically. VAT (16%) is applied if currency is MZN and "Prices VAT inclusive" is unchecked.</li>
                    </ul>
                  </li>
                  <li><strong>Load from Requisition:</strong> Select an "Approved" requisition from the dropdown. PO items will be populated. You must then select a supplier and approver, and adjust prices. The item's site is derived from the Requisition's header site.</li>
                  <li><strong>Load Existing PO for Editing:</strong> Type an existing PO number in the "PO Number" field and click "Load". The form will populate if the PO is in 'Draft', 'Pending Approval', or 'Rejected' status.</li>
                  <li><strong>Submission & Status:</strong>
                     <ul className="list-['--'] list-inside ml-6">
                        <li>Assigning an approver and saving typically sets the status to 'Pending Approval'.</li>
                        <li>If no approver is assigned, the PO is saved as 'Draft'.</li>
                        <li>If editing a 'Rejected' PO, resubmitting with an approver changes its status to 'Pending Approval'.</li>
                    </ul>
                  </li>
                  <li><strong>List View Actions:</strong>
                    <ul className="list-['--'] list-inside ml-6">
                       <li><strong>View/Print (<Eye className="inline h-4 w-4" />):</strong> Opens a print-friendly preview page with options to print or download PDF.</li>
                       <li><strong>Edit (<Edit className="inline h-4 w-4" />):</strong> Available for 'Draft', 'Pending Approval', 'Rejected' POs. Takes you back to the PO form.</li>
                       <li><strong>Delete (<Trash2 className="inline h-4 w-4 text-destructive" />):</strong> Available for 'Draft' and 'Rejected' POs. A confirmation dialog will appear.</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><Truck className="mr-2 h-5 w-5 text-primary" />4.2 Goods Received Notes (GRN)</h3>
                <p>Record the receipt of goods against an 'Approved' Purchase Order. Accessible via "Create Document" &rarr; "GRNs" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Select PO:</strong> Choose an 'Approved' PO from the dropdown. Only POs with items not yet fully received will appear.</li>
                  <li><strong>GRN Details:</strong> Enter GRN Date and optional Supplier Delivery Note number.</li>
                  <li><strong>Record Quantities:</strong> For each item (which will display its designated site from the PO), enter the quantity being received in "Receive Now". The system shows ordered, previously received, and outstanding quantities. Use the "All" button to quickly fill outstanding quantity.</li>
                  <li><strong>Item Notes:</strong> Add specific notes for individual items (e.g., batch number, condition).</li>
                  <li><strong>Overall Notes:</strong> Add general comments about the delivery.</li>
                  <li><strong>Confirm Receipt:</strong> This action:
                    <ul className="list-['-_'] list-inside ml-6">
                        <li>Sends data to the backend (`/api/grn`) to update `POItem.quantityReceived`, `POItem.itemStatus`, and the overall `PurchaseOrder.status` (to 'Partially Received' or 'Completed').</li>
                        <li>Logs the GRN activity in the database.</li>
                        <li>Displays a "GRN Confirmed" view with a printable preview of the GRN.</li>
                        <li>From the preview, you can "Print GRN" or start a "Create New GRN". PDF download is planned.</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><FileSignature className="mr-2 h-5 w-5 text-primary" />4.3 Client Quotations</h3>
                <p>Provide price quotes to clients. Accessible via "Create Document" &rarr; "Client Quotes" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New Quote:</strong> Select a client, enter quote details (date, currency), assign an approver (optional), add line items with descriptions, quantities, and unit prices.</li>
                  <li><strong>Load Existing Quote for Editing:</strong> Type an existing Quote number and click "Load". Editable if in 'Draft' or 'Pending Approval' status.</li>
                  <li><strong>Terms & Notes:</strong> Add specific terms and conditions or additional notes for the client.</li>
                  <li><strong>Submission & Status:</strong> Assigning an approver and saving typically sets the status to 'Pending Approval'. If no approver is assigned, the Quote is saved as 'Draft'.</li>
                  <li><strong>List View Actions:</strong> Similar to POs (View/Print, Edit for 'Draft'/'Pending Approval', Delete for 'Draft'/'Rejected'). A confirmation dialog will appear for deletion.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary" />4.4 Purchase Requisitions</h3>
                <p>Internal requests for goods or services. Accessible via "Create Document" &rarr; "Requisitions" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New Requisition:</strong> Select requestor, site/department for the requisition header, date, assign an approver (optional). Add line items with part numbers, descriptions, categories, quantities, and item-specific justification.</li>
                   <li><strong>Load Existing Requisition for Editing:</strong> Available via "List of Requisitions" &rarr; Edit icon (<Edit className="inline h-4 w-4" />). Editable if in 'Draft', 'Pending Approval', or 'Rejected' status.</li>
                  <li><strong>Submission & Status:</strong> Assigning an approver and saving typically sets the status to 'Pending Approval'. If no approver is assigned, the Requisition is saved as 'Draft'. Editing a 'Rejected' Requisition and re-assigning an approver will move it to 'Pending Approval'.</li>
                  <li><strong>List View Actions:</strong> Similar to POs (View/Print, Edit for 'Draft'/'Pending Approval'/'Rejected', Delete for 'Draft'/'Rejected'). A confirmation dialog will appear for deletion.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><Fuel className="mr-2 h-5 w-5 text-primary" />4.5 Fuel Records</h3>
                <p>Log fuel consumption for vehicles/equipment. Accessible via "Create Document" &rarr; "Fuel Records" tab. (Backend saving currently simulated)</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Record Entry:</strong> Select date, tag (vehicle/equipment), site, enter driver name, odometer reading, fuel quantity, unit cost, and other optional details like Requisition No. or Invoice No.</li>
                  <li><strong>Total Cost:</strong> Calculated automatically.</li>
                  <li><strong>List View:</strong> Displays logged records. "Distance Travelled" between entries for the same tag is calculated and shown. Filters for list view include Month, Year, Site, Tag, and Driver name.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="approvals">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><UserCheck className="mr-2 h-6 w-6 text-primary" />5. My Approvals Page</h2>
            <p>
              This consolidated page lists all documents (Purchase Orders, Client Quotes, Purchase Requisitions) assigned to you (currently mocked as 'pita.domingos@jachris.com') that are in 'Pending Approval' status.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li><strong>View Details (<Eye className="inline h-4 w-4" />):</strong> Opens a print-friendly preview of the document.</li>
              <li><strong>Approve (<CheckCircle className="inline h-4 w-4 text-green-600" />):</strong> Changes the document status to 'Approved' and records the approval date.</li>
              <li><strong>Reject (<Trash2 className="inline h-4 w-4 text-red-600" />):</strong> Opens a dialog to optionally provide a rejection reason and changes status to 'Rejected'. The creator may need to revise the document (if its status allows editing) or create a new one based on feedback communicated (e.g., via the optional rejection reason or offline).</li>
              <li><strong>Review (POs only, <Edit2 className="inline h-4 w-4 text-blue-600" />):</strong> Opens a modal to review PO items, check specific items, and add comments. This action currently simulates notifying the creator for feedback; the PO status remains 'Pending Approval'.</li>
              <li><strong>Refresh:</strong> Fetches the latest list of pending items from the server.</li>
            </ul>
          </section>

          <section id="management">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" />6. Management Section</h2>
            <p>
              The Management hub allows administrators to configure core data entities required for the application's operation. Each sub-section provides a list view with Add, Edit, and Delete capabilities (with confirmation dialogs).
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-2">
              <li><strong>Sites (<Building className="inline h-4 w-4" />):</strong> Manage company sites, locations, or departments (name, location, site code). Used in PO items, Requisition headers, and Tag assignments.</li>
              <li><strong>Suppliers (<PackageIcon className="inline h-4 w-4" />):</strong> Manage vendor details (code, name, contact info, etc.). <strong className="text-primary">CSV Upload available.</strong> Download template for format.</li>
              <li><strong>Approvers (<Users className="inline h-4 w-4" />):</strong> Define users who can approve documents (POs, Quotes, Requisitions) and optionally set their approval limits.</li>
              <li><strong>Users (<Users className="inline h-4 w-4" />):</strong> Manage system user accounts, roles (Admin, Creator, Approver, etc.), and active status. Site access is displayed but managed separately (future feature).</li>
              <li><strong>Categories (<TagLucideIcon className="inline h-4 w-4" />):</strong> Define item/service categories used in POs and Requisitions.</li>
              <li><strong>Tags (Vehicles/Equipment, <TagLucideIcon className="inline h-4 w-4" />):</strong> Manage tagged assets like vehicles or machinery, including their status and assigned site. <strong className="text-primary">CSV Upload available.</strong> Download template.</li>
              <li><strong>Clients (<Briefcase className="inline h-4 w-4" />):</strong> Manage client information for quotations. <strong className="text-primary">CSV Upload available.</strong> Download template.</li>
              <li><strong>Allocations (<CaseSensitive className="inline h-4 w-4" />):</strong> (Legacy Data) Read-only display of legacy cost allocations/departments. For current operational locations, use "Manage Sites".</li>
            </ul>
             <p className="mt-2 text-sm flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-orange-500" /> You generally cannot delete entities (e.g., a Site or Supplier) if they are referenced by other active records (like POs or Users assigned to a site). Resolve references first.</p>
          </section>

          <section id="analytics">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><BarChart3 className="mr-2 h-6 w-6 text-primary" />7. Analytics</h2>
            <p>
              The Analytics page provides visual insights into your procurement data. You can filter charts by month and year. Current charts include:
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Monthly PO Status (Approved vs. Pending)</li>
              <li>PO Value by Site & Status (Approved vs. Pending Approval)</li>
              <li>Requisitions by Status (Pie Chart)</li>
              <li>Client Quotes by Status (Pie Chart)</li>
            </ul>
            <p className="mt-1">Placeholder sections for GRN, specific Quote, Requisition, and Fuel analytics show potential future charts.</p>
          </section>
          
          <section id="activity-log-page">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><ListChecksIcon className="mr-2 h-6 w-6 text-primary" />8. Activity Log Page</h2>
            <p>
             Tracks system and user activities. The Dashboard shows the latest 20 entries. The dedicated "Activity Log" page provides a comprehensive view with filtering by:
            </p>
             <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Month and Year</li>
              <li>User name (partial match)</li>
              <li>Action description (partial match)</li>
              <li>Limit of records displayed (default 200, but can be overridden).</li>
            </ul>
            <p className="mt-1">This data is fetched directly from the `ActivityLog` table in the database.</p>
          </section>

          <section id="printing">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><Printer className="mr-2 h-6 w-6 text-primary" />9. Printing Documents</h2>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>When viewing a PO, Quote, Requisition, or confirmed GRN on its dedicated preview page (e.g., `/purchase-orders/[id]/print`), "Print" buttons are available.</li>
              <li>These use the browser's print functionality to generate a printout or save as PDF.</li>
              <li>The print layout is optimized to show only the document content on a clean white background.</li>
              <li>For POs, a "Download PDF" option is available, generating the PDF on the server using Playwright. This is planned for other documents.</li>
              <li>Page numbers and repeating page footers (e.g., "Page X of Y") rely on your browser's print settings.</li>
              <li>The document footer (totals, authorization) will appear at the bottom of the last page of content due to "sticky footer" CSS.</li>
              <li>If a document spans multiple pages, table headers (`<thead>`) for item lists will repeat on each new page. The main document header (logo, title) will appear only on the first page.</li>
            </ul>
          </section>

          <section id="feedback-survey">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><MessageCircleQuestion className="mr-2 h-6 w-6 text-primary" />10. Feedback Survey</h2>
            <p>
              The "Feedback Survey" page allows you to provide valuable input on your experience with ProcureTrack. Please share your thoughts on ease of use, features, and any suggestions for improvement. (Submission is currently simulated and logs to the console).
            </p>
          </section>

          <section id="faq">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><HelpCircle className="mr-2 h-6 w-6 text-primary" />11. Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground">Q: How do I create a new Purchase Order (PO)?</h4>
                <p>A: Navigate to "Create Document" &rarr; "Purchase Orders" tab. Fill in the required supplier, PO details, and item information. Assign an approver to submit it for approval, or leave blank to save as a Draft.</p>
              </div>
               <div>
                <h4 className="font-medium text-foreground">Q: Can I create a PO from an approved Requisition?</h4>
                <p>A: Yes. On the PO Form ("Create Document" &rarr; "Purchase Orders"), if there are approved requisitions, a dropdown will appear. Select one and click "Load Items". The PO items will populate. You'll still need to select a supplier, approver, and verify pricing. Item sites on the PO will be derived from the Requisition's header site.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How can I edit an existing PO, Quote, or Requisition?</h4>
                <p>A: Go to the list view for that document type (e.g., "Create Document" &rarr; "Purchase Orders" &rarr; "List of POs"). If the document is in 'Draft', 'Pending Approval', or 'Rejected' status, an "Edit" icon (<Edit className="inline h-4 w-4" />) will be available. Clicking it will take you to the respective form pre-filled with the document's data. Alternatively, for POs and Quotes, you can type the document number into the form's "PO Number" or "Quote Number" field and click "Load" (if it's not already loaded for edit from the URL).</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: When can I delete a PO, Quote, or Requisition?</h4>
                <p>A: Deletion is typically allowed only for documents in 'Draft' or 'Rejected' status to maintain audit trails for processed documents. Use the "Delete" icon (<Trash2 className="inline h-4 w-4 text-destructive" />) in the document's list view. A confirmation dialog will appear.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: The PO/Quote/Requisition number is read-only when editing. Why?</h4>
                <p>A: Document numbers are unique identifiers. Once assigned (especially after initial save or loading an existing document), they generally cannot be changed to preserve data integrity and history.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How is VAT calculated on Purchase Orders?</h4>
                <p>A: If the selected currency is MZN and the "Prices VAT inclusive" checkbox is NOT checked, VAT (16%) is calculated on the subtotal and added to get the grand total. For other currencies or if VAT is inclusive, the VAT amount field will show 0 or "IVA Incl." respectively.</p>
              </div>
               <div>
                <h4 className="font-medium text-foreground">Q: Why can't I find a Purchase Order in the GRN selection dropdown?</h4>
                <p>A: The GRN dropdown only lists Purchase Orders that are in 'Approved' status AND have at least one item that has not yet been fully received. Check the PO status and item receipt status.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: What happens when I "Confirm Receipt" for a GRN?</h4>
                <p>A: The system makes an API call to the backend. This call updates the `quantityReceived` and `itemStatus` for each PO item included in the GRN. It also updates the overall PO status (e.g., to 'Partially Received' or 'Completed') and logs the GRN activity. You are then shown a preview of the GRN, which you can print.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How do I upload data using CSV in the Management section?</h4>
                <p>A: For Clients, Suppliers, and Tags, there's an "Upload CSV" button on their respective management pages. Click it, select your CSV file. It's highly recommended to first download the provided template for that entity (link usually next to the upload button) to ensure your CSV columns match the expected format and headers.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Why can't I delete a Site, Supplier, or User?</h4>
                <p>A: If an entity is referenced by other records (e.g., a Supplier linked to existing POs, a Site assigned to Users or Tags), the system will prevent deletion to maintain data integrity. You must remove these references first (e.g., reassign POs to a different supplier, unassign users from a site).</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: My document is not appearing in the "My Approvals" list. Why?</h4>
                <p>A: Ensure the document (PO, Quote, or Requisition) is in 'Pending Approval' status AND is assigned to your user account (currently, the approvals page is mocked for 'pita.domingos@jachris.com'). Also, refresh the list.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: What happens when I "Reject" a document in the "My Approvals" page?</h4>
                <p>A: The document's status is changed to 'Rejected'. The original creator will see this status. Depending on the workflow, they may need to revise the document (if its status allows editing) or create a new one based on feedback communicated (e.g., via the optional rejection reason or offline).</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: When printing, the document content doesn't fill the page, or the footer is not at the bottom.</h4>
                <p>A: The system uses CSS to try and make the footer "sticky" at the bottom of the last page. If the content is very short, it should be pushed down. If you encounter issues, check your browser's print preview settings for scaling or "fit to page" options, which might affect this.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: I see an error message like "Failed to fetch..." or "Incorrect arguments to mysqld_stmt_execute". What should I do?</h4>
                <p>A: First, check your internet connection. Try refreshing the page or retrying the action. If the error persists, note down the full error message (especially details from the server if shown in a toast or console) and report it to system support. "Incorrect arguments" usually indicates a backend database query issue that needs investigation by the development team.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Where can I find documentation on the system's architecture or code?</h4>
                <p>A: Navigate to "System Documentation" from the sidebar. This page provides an overview of the technologies used, key files, and architecture.</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
