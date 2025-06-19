
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookUser, FilePlus2, CheckCircle, Settings, AlertCircle, ArrowRight, UploadCloud, LayoutDashboard, BarChart3, ListChecks, Printer, HelpCircle, Fuel, Truck, FileSignature, ClipboardList, TagIcon, Users, Building, PackageIcon, CaseSensitive, Workflow, Palette } from "lucide-react"; // Added more icons

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
            <h2 className="text-2xl font-semibold mb-3 text-foreground">2. Getting Started</h2>
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
              <li><strong>Recent Activity Log:</strong> Shows the latest 20 system and user activities.</li>
              <li><strong>Refresh Data:</strong> A button to manually refresh all dashboard data.</li>
            </ul>
          </section>

          <section id="create-document">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><FilePlus2 className="mr-2 h-6 w-6 text-primary" />4. Creating & Managing Documents</h2>
            <p className="mb-3">The "Create Document" page is your central hub for initiating various procurement and operational records. It features a tabbed interface for different document types. Each document type also has a "List View" tab to see existing documents, apply filters, and perform actions like View, Edit, or Delete (depending on document status).</p>
            
            <div className="ml-4 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><FileSignature className="mr-2 h-5 w-5 text-primary" />4.1 Purchase Orders (PO)</h3>
                <p>Formalize orders with suppliers. Accessible via "Create Document" &rarr; "Purchase Orders" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New PO:</strong>
                    <ul className="list-['-_'] list-inside ml-6">
                      <li>Fill supplier details (or select existing), PO information (date, currency, requester name), assign an approver. The overall PO header site is not used from this form; site is specified per item.</li>
                      <li>Add line items: part number, description, category, specific site for the item, UOM, quantity, and unit price.</li>
                      <li>Totals (Subtotal, VAT, Grand Total) are calculated automatically. VAT is applied if currency is MZN and "Prices VAT inclusive" is unchecked.</li>
                    </ul>
                  </li>
                  <li><strong>Load from Requisition:</strong> Select an "Approved" requisition from the dropdown. PO items will be populated. You must then select a supplier and approver, and adjust prices. The item's site is derived from the Requisition's header site.</li>
                  <li><strong>Load Existing PO for Editing:</strong> Type an existing PO number in the "PO Number" field and click "Load". The form will populate if the PO is in 'Draft', 'Pending Approval', or 'Rejected' status.</li>
                  <li><strong>Submission:</strong> Saving a PO with an assigned approver sets its status to 'Pending Approval'. If no approver is set, it's saved as 'Draft'. If editing a 'Rejected' PO, resubmitting with an approver changes status to 'Pending Approval'.</li>
                  <li><strong>List View Actions:</strong>
                    <ul className="list-['--'] list-inside ml-6">
                       <li><strong>View/Print:</strong> Opens a print-friendly preview page.</li>
                       <li><strong>Edit:</strong> Available for 'Draft', 'Pending Approval', 'Rejected' POs. Takes you back to the PO form.</li>
                       <li><strong>Delete:</strong> Available for 'Draft' and 'Rejected' POs.</li>
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
                        <li>Logs the GRN activity.</li>
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
                  <li><strong>Submission:</strong> Assigning an approver moves the quote to 'Pending Approval'. If no approver, it's saved as 'Draft'.</li>
                  <li><strong>List View Actions:</strong> Similar to POs (View/Print, Edit for 'Draft'/'Pending Approval', Delete for 'Draft'/'Rejected').</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary" />4.4 Purchase Requisitions</h3>
                <p>Internal requests for goods or services. Accessible via "Create Document" &rarr; "Requisitions" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Create New Requisition:</strong> Select requestor, site/department for the requisition header, date, assign an approver (optional). Add line items with part numbers, descriptions, categories, quantities, and item-specific justification.</li>
                  <li><strong>Submission:</strong> Assigning an approver sets status to 'Pending Approval'. If no approver, saved as 'Draft'. If editing a 'Rejected' Requisition, resubmitting with an approver changes status to 'Pending Approval'.</li>
                  <li><strong>List View Actions:</strong> Similar to POs (View/Print, Edit for 'Draft'/'Pending Approval'/'Rejected', Delete for 'Draft'/'Rejected').</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center"><Fuel className="mr-2 h-5 w-5 text-primary" />4.5 Fuel Records</h3>
                <p>Log fuel consumption for vehicles/equipment. Accessible via "Create Document" &rarr; "Fuel Records" tab.</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Record Entry:</strong> Select date, tag (vehicle/equipment), site, enter driver name, odometer reading, fuel quantity, unit cost, and other optional details.</li>
                  <li><strong>Total Cost:</strong> Calculated automatically.</li>
                  <li><strong>List View:</strong> Displays logged records. "Distance Travelled" between entries for the same tag is calculated and shown. (Backend saving for fuel records is currently simulated/mocked).</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="approvals">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><CheckCircle className="mr-2 h-6 w-6 text-primary" />5. My Approvals Page</h2>
            <p>
              This consolidated page lists all documents (Purchase Orders, Client Quotes, Purchase Requisitions) assigned to you (currently mocked as 'pita.domingos@jachris.com') that are 'Pending Approval'.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li><strong>View Details:</strong> Opens a print-friendly preview of the document.</li>
              <li><strong>Approve:</strong> Changes the document status to 'Approved'.</li>
              <li><strong>Reject:</strong> Opens a dialog to optionally provide a rejection reason and changes status to 'Rejected'. The creator may need to revise or recreate the document.</li>
              <li><strong>Review (POs only):</strong> Opens a modal to review PO items, check specific items, and add comments. This action (currently simulated) would typically notify the creator for feedback; PO status remains 'Pending Approval'.</li>
              <li><strong>Refresh:</strong> Fetches the latest list of pending items.</li>
            </ul>
          </section>

          <section id="management">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" />6. Management Section</h2>
            <p>
              The Management hub allows administrators to configure core data. Each sub-section provides a list view with Add, Edit, and Delete options.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-2">
              <li><strong>Sites:</strong> Manage company sites/locations (name, location, site code).</li>
              <li><strong>Suppliers:</strong> Manage vendor details. <strong className="text-primary">CSV Upload available.</strong> Download template for format.</li>
              <li><strong>Approvers:</strong> Define users who can approve documents and their approval limits.</li>
              <li><strong>Users:</strong> Manage system user accounts, roles, and active status. Site access is displayed but managed separately (future feature).</li>
              <li><strong>Categories:</strong> Define item/service categories for POs and Requisitions.</li>
              <li><strong>Tags (Vehicles/Equipment):</strong> Manage tagged assets. <strong className="text-primary">CSV Upload available.</strong> Download template.</li>
              <li><strong>Clients:</strong> Manage client information for quotations. <strong className="text-primary">CSV Upload available.</strong> Download template.</li>
              <li><strong>Allocations:</strong> (Legacy) Read-only display of legacy cost allocations. Use "Manage Sites" for current locations.</li>
            </ul>
             <p className="mt-2 text-sm flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-orange-500" /> You generally cannot delete entities (e.g., a Site or Supplier) if they are referenced by other records (like POs or Users).</p>
          </section>

          <section id="analytics">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><BarChart3 className="mr-2 h-6 w-6 text-primary" />7. Analytics</h2>
            <p>
              The Analytics page provides visual insights into your procurement data. You can filter charts by month and year. Current charts include:
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Monthly PO Status (Approved vs. Pending)</li>
              <li>PO Value by Site & Status</li>
              <li>Requisitions by Status</li>
              <li>Quotes by Status</li>
              <li>Spend by Vendor</li>
              <li>PO Count by Category</li>
            </ul>
            <p className="mt-1">Placeholder sections for GRN, specific Quote, Requisition, and Fuel analytics show potential future charts.</p>
          </section>
          
          <section id="activity-log">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><ListChecksIcon className="mr-2 h-6 w-6 text-primary" />8. Activity Log</h2>
            <p>
             Tracks system and user activities. The Dashboard shows the latest 20 entries. The dedicated "Activity Log" page provides a comprehensive view with filtering by:
            </p>
             <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Month and Year</li>
              <li>User name (partial match)</li>
              <li>Action description (partial match)</li>
            </ul>
          </section>

          <section id="printing">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><Printer className="mr-2 h-6 w-6 text-primary" />9. Printing Documents</h2>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>When viewing a PO, Quote, Requisition, or confirmed GRN, "Print" buttons are available.</li>
              <li>These use the browser's print functionality to generate a printout or save as PDF.</li>
              <li>The print layout is optimized to show only the document content on a white background.</li>
              <li>For POs, a "Download PDF" option is available, generating the PDF on the server. This is planned for other documents.</li>
              <li>Page numbers and repeating page footers (e.g., "Page X of Y") rely on your browser's print settings.</li>
              <li>The document footer (totals, authorization) will appear at the bottom of the last page of content.</li>
            </ul>
          </section>

          <section id="feedback-survey">
            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center"><MessageCircleQuestion className="mr-2 h-6 w-6 text-primary" />10. Feedback Survey</h2>
            <p>
              The "Feedback Survey" page allows you to provide valuable input on your experience with ProcureTrack. Please share your thoughts on ease of use, features, and any suggestions for improvement. (Submission is currently simulated).
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
                <h4 className="font-medium text-foreground">Q: How can I edit an existing PO, Quote, or Requisition?</h4>
                <p>A: Go to the list view for that document type (e.g., "Create Document" &rarr; "Purchase Orders" &rarr; "List of POs"). If the document is in 'Draft', 'Pending Approval', or 'Rejected' status, an "Edit" button will be available. Clicking it will load the document into the form for modification.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: When can I delete a PO, Quote, or Requisition?</h4>
                <p>A: Deletion is typically allowed only for documents in 'Draft' or 'Rejected' status to maintain audit trails for processed documents. Use the "Delete" button in the document's list view.</p>
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
                <p>A: The system makes an API call to the backend. This call updates the `quantityReceived` and `itemStatus` for each PO item included in the GRN. It also updates the overall PO status (e.g., to 'Partially Received' or 'Completed') and logs the GRN activity. You are then shown a preview of the GRN.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: How do I upload data using CSV in the Management section?</h4>
                <p>A: For Clients, Suppliers, and Tags, there's an "Upload CSV" button. Click it, select your CSV file. It's recommended to first download the provided template for that entity to ensure your CSV columns match the expected format.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: Why can't I delete a Site, Supplier, or User?</h4>
                <p>A: If an entity is referenced by other records (e.g., a Supplier linked to existing POs, a Site assigned to Users or Tags), the system will prevent deletion to maintain data integrity. You must remove these references first.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: My document is not appearing in the "My Approvals" list. Why?</h4>
                <p>A: Ensure the document (PO, Quote, or Requisition) is in 'Pending Approval' status AND is assigned to your user account (currently, the approvals page is mocked for 'pita.domingos@jachris.com').</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: What happens when I "Reject" a document in the "My Approvals" page?</h4>
                <p>A: The document's status is changed to 'Rejected'. The original creator will see this status and may need to revise the document (if editable) or create a new one based on offline communication of the rejection reason.</p>
              </div>
               <div>
                <h4 className="font-medium text-foreground">Q: When printing, the whole screen appears instead of just the document.</h4>
                <p>A: This should be resolved with the latest print CSS. If it persists, ensure you are using the "Print" button on the document's dedicated print preview page (e.g., `/purchase-orders/[id]/print`). Also, check your browser's print settings for any unusual configurations.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Q: I see an error message like "Failed to fetch..." or "Incorrect arguments to mysqld_stmt_execute". What should I do?</h4>
                <p>A: First, check your internet connection. Try refreshing the page or retrying the action. If the error persists, note down the full error message (especially details from the server if shown in a toast) and report it to system support. "Incorrect arguments" usually indicates a backend database issue.</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

    