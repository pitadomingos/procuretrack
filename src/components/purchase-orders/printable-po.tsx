
'use client';

import type { PurchaseOrderPayload, POItemPayload, Supplier } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface FullPODataForPrint extends PurchaseOrderPayload {
  supplierDetails?: Supplier;
  // If category names / site codes are resolved, add them here or look up
}

interface PrintablePOProps {
  poData: FullPODataForPrint;
}

// Placeholder Company Details - Move to config later
const JACHRIS_COMPANY_DETAILS = {
  name: 'Jachris Mining Services, Lda.',
  addressLine1: 'Estrada Nacional N7, Matema',
  addressLine2: 'Moatize, Tete, Mozambique',
  nuit: '400 415 954',
  contact: 'Tel: +258 84 784 3306 / +258 86 784 3305',
  email: 'procurement@jachris.com',
  logoUrl: 'https://placehold.co/200x80.png?text=Jachris+Logo', // Replace with actual logo URL
};

const TERMS_AND_CONDITIONS = [
  "1. All goods must be delivered to the address specified on this order.",
  "2. Payment terms are 30 days from date of invoice, unless otherwise agreed in writing.",
  "3. This Purchase Order number must appear on all invoices, delivery notes, and correspondence.",
  "4. Jachris Mining Services reserves the right to cancel this order if goods are not delivered by the agreed date.",
  "5. All goods supplied must be of satisfactory quality and fit for purpose."
];


export function PrintablePO({ poData }: PrintablePOProps) {
  const { supplierDetails } = poData;

  const poCreationDate = poData.creationDate ? new Date(poData.creationDate).toLocaleDateString() : 'N/A';

  // Helper to get category name (mocked for now)
  const getCategoryDisplay = (categoryId: number | null): string => {
    // In a real app, you'd have categories data to look this up
    return categoryId ? `Category ID: ${categoryId}` : 'N/A';
  };

  // Helper to get site display (mocked for now)
  const getSiteDisplay = (siteId: number | null): string => {
    // In a real app, you'd have sites data to look this up
    return siteId ? `Site ID: ${siteId}` : 'N/A';
  };

  return (
    <Card className="w-full shadow-lg print:shadow-none print:border-none rounded-lg">
      <CardContent className="p-6 sm:p-8 print:p-0">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="mb-4 sm:mb-0">
              <img 
                src={JACHRIS_COMPANY_DETAILS.logoUrl} 
                alt={`${JACHRIS_COMPANY_DETAILS.name} Logo`} 
                className="h-16 object-contain print:h-20" 
                data-ai-hint="company logo"
              />
              <h1 className="text-2xl font-bold text-primary mt-2">{JACHRIS_COMPANY_DETAILS.name}</h1>
              <p className="text-xs text-muted-foreground">{JACHRIS_COMPANY_DETAILS.addressLine1}</p>
              <p className="text-xs text-muted-foreground">{JACHRIS_COMPANY_DETAILS.addressLine2}</p>
              <p className="text-xs text-muted-foreground">NUIT: {JACHRIS_COMPANY_DETAILS.nuit}</p>
              <p className="text-xs text-muted-foreground">{JACHRIS_COMPANY_DETAILS.contact}</p>
              <p className="text-xs text-muted-foreground">Email: {JACHRIS_COMPANY_DETAILS.email}</p>
            </div>
            <div className="text-left sm:text-right">
              <h2 className="text-3xl font-bold text-primary mb-2 print:text-4xl">PURCHASE ORDER</h2>
              <p className="text-sm"><strong>PO Number:</strong> {poData.poNumber}</p>
              <p className="text-sm"><strong>Date:</strong> {poCreationDate}</p>
              <p className="text-sm"><strong>Status:</strong> {poData.status}</p>
              {poData.quoteNo && <p className="text-sm"><strong>Quote No.:</strong> {poData.quoteNo}</p>}
            </div>
          </div>
        </header>

        <Separator className="my-6 print:my-8" />

        {/* Supplier and Requester Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:mb-8">
          <div>
            <h3 className="font-semibold text-primary mb-1">SUPPLIER:</h3>
            {supplierDetails ? (
              <>
                <p className="font-medium">{supplierDetails.supplierName}</p>
                {supplierDetails.physicalAddress && <p className="text-sm">{supplierDetails.physicalAddress}</p>}
                {supplierDetails.emailAddress && <p className="text-sm">Email: {supplierDetails.emailAddress}</p>}
                {supplierDetails.cellNumber && <p className="text-sm">Tel: {supplierDetails.cellNumber}</p>}
                {supplierDetails.nuitNumber && <p className="text-sm">NUIT: {supplierDetails.nuitNumber}</p>}
                {supplierDetails.salesPerson && <p className="text-sm">Contact: {supplierDetails.salesPerson}</p>}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Supplier details not found.</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">REQUESTER DETAILS:</h3>
            <p className="text-sm"><strong>Requested By:</strong> {poData.requestedByName || 'N/A'}</p>
            {/* Add Creator and Approver once resolved names are available */}
            {/* <p className="text-sm"><strong>Created By:</strong> {poData.creatorName || 'System User (TBD)'}</p> */}
            {/* <p className="text-sm"><strong>Approved By:</strong> {poData.approverName || 'Pending Approval'}</p> */}
          </div>
        </section>

        {/* Items Table */}
        <section className="mb-6 print:mb-8">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 print:bg-gray-100">
                <TableHead className="w-[50px] print:w-12">No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Part No.</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Site</TableHead>
                <TableHead className="text-right">UOM</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price ({poData.currency})</TableHead>
                <TableHead className="text-right">Total ({poData.currency})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poData.items.map((item, index) => (
                <TableRow key={item.partNumber || index}>
                  <TableCell className="print:py-1">{index + 1}</TableCell>
                  <TableCell className="font-medium print:py-1">{item.description}</TableCell>
                  <TableCell className="hidden sm:table-cell print:py-1">{item.partNumber || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell print:py-1">{getCategoryDisplay(item.categoryId)}</TableCell>
                  <TableCell className="hidden md:table-cell print:py-1">{getSiteDisplay(item.allocation ? Number(item.allocation) : null)}</TableCell>
                  <TableCell className="text-right print:py-1">{item.uom}</TableCell>
                  <TableCell className="text-right print:py-1">{item.quantity}</TableCell>
                  <TableCell className="text-right print:py-1">{item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right print:py-1">{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Totals Section */}
        <section className="flex justify-end mb-6 print:mb-8">
          <div className="w-full sm:w-auto sm:min-w-[280px] space-y-1 text-sm">
            <div className="flex justify-between py-1 border-b">
              <span>Subtotal:</span>
              <span className="font-medium">{poData.currency} {poData.subTotal.toFixed(2)}</span>
            </div>
            {poData.currency === 'MZN' && (
              <div className="flex justify-between py-1 border-b">
                <span>VAT (16%):</span>
                <span className="font-medium">{poData.currency} {poData.vatAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-primary mt-2">
              <span>GRAND TOTAL:</span>
              <span>{poData.currency} {poData.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        {poData.notes && (
          <section className="mb-6 print:mb-8">
            <h3 className="font-semibold text-primary mb-1">Notes:</h3>
            <p className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">{poData.notes}</p>
          </section>
        )}

        {/* Terms and Conditions */}
        <section className="mb-6 print:mb-8">
          <h3 className="font-semibold text-primary mb-2">Terms &amp; Conditions:</h3>
          <ol className="list-decimal list-inside text-xs space-y-1 text-muted-foreground">
            {TERMS_AND_CONDITIONS.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ol>
        </section>

        {/* Signature Section */}
        <footer className="pt-8 mt-8 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="mb-1 text-sm font-medium">Prepared By:</p>
              <div className="h-16 border-b mb-1 print:h-20"></div>
              <p className="text-xs text-muted-foreground">Procurement Department</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Approved By:</p>
              <div className="h-16 border-b mb-1 print:h-20"></div>
              <p className="text-xs text-muted-foreground">Authorised Signatory</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 print:mt-12">
            Thank you for your business!
          </p>
        </footer>

      </CardContent>
    </Card>
  );
}
