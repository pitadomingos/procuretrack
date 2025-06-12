
'use client';

import type { PurchaseOrderPayload, POItemForPrint, Supplier } from '@/types';

interface FullPODataForPrint extends Omit<PurchaseOrderPayload, 'items'> {
  items: POItemForPrint[];
  supplierDetails?: Supplier;
  approverName?: string;
  // quoteNo might come from form, or be part of PurchaseOrderPayload if saved
}

interface PrintablePOProps {
  poData: FullPODataForPrint;
}

// Company Details from Template
const JACHRIS_COMPANY_DETAILS = {
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  contactLine1: 'M: +258 85 545 8462 | +27 (0)11 813 4009',
  address: 'Quinta do Bom Sol, Bairro Chithatha, Moatize, Mozambique',
  website: 'www.jachris.com',
  logoUrl: 'https://placehold.co/150x60/f8f8f8/c70000?text=JACHRIS&font=roboto', // Placeholder for JACHRIS logo with red element
  nuit: '400 415 954', // From other parts of app, not on PO template header directly but good to have
};


export function PrintablePO({ poData }: PrintablePOProps) {
  const { supplierDetails, items } = poData;

  const poCreationDate = poData.creationDate ? new Date(poData.creationDate).toLocaleDateString('en-GB') : 'N/A';
  const approvalDate = poData.approvalDate ? new Date(poData.approvalDate).toLocaleDateString('en-GB') : 'N/A';

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white p-4 font-sans text-xs" style={{ fontFamily: "'Arial', sans-serif" }}> {/* Styles to mimic template */}
      {/* Page Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-bold text-red-700">{JACHRIS_COMPANY_DETAILS.name}</h1>
          <p>{JACHRIS_COMPANY_DETAILS.contactLine1}</p>
          <p>{JACHRIS_COMPANY_DETAILS.address}</p>
          <p className="text-red-700">{JACHRIS_COMPANY_DETAILS.website}</p>
        </div>
        <div className="text-right">
          {/* Placeholder for JACHRIS logo with red triangle. User should replace this. */}
          <img 
            src={JACHRIS_COMPANY_DETAILS.logoUrl} 
            alt="JACHRIS Logo" 
            className="h-12 mb-1 ml-auto"
            data-ai-hint="company brand logo"
             />
          <h2 className="text-xl font-bold">Purchase Order</h2>
        </div>
      </div>

      {/* PO Number and Date */}
      <div className="flex justify-between items-center mb-2 pb-1 border-b-2 border-black">
        <span className="text-lg font-bold text-red-700">{poData.poNumber}</span>
        <span className="text-sm"><strong>Date:</strong> {poCreationDate}</span>
      </div>

      {/* Supplier and Other Info */}
      <div className="grid grid-cols-2 gap-x-4 mb-4 text-xs">
        <div>
          <p className="mb-1"><strong>TO:</strong></p>
          <div className="grid grid-cols-[max-content_1fr] gap-x-2">
            <span>SUPPLIER NAME</span><span>: {supplierDetails?.supplierName || 'N/A'}</span>
            <span>SUPPLIER ADDRESS</span><span>: {supplierDetails?.physicalAddress || 'N/A'}</span>
            <span>SALES PERSON</span><span>: {supplierDetails?.salesPerson || 'N/A'}</span>
            <span>CONTACT NUMBER</span><span>: {supplierDetails?.cellNumber || 'N/A'}</span>
            <span>EMAIL ADDRESS</span><span>: {supplierDetails?.emailAddress || 'N/A'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-grid grid-cols-[max-content_1fr] gap-x-2">
            <span>NUIT</span><span>: {supplierDetails?.nuitNumber || 'N/A'}</span>
            <span>QUOTE No.</span><span>: {poData.quoteNo || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-1 min-h-[300px]"> {/* min-h to ensure table area has some space */}
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-left">PART NUMBER</th>
              <th className="border border-black p-1 text-left">DESCRIPTION</th>
              <th className="border border-black p-1 text-left">ALLOCATION</th>
              <th className="border border-black p-1 text-center">UNIT</th>
              <th className="border border-black p-1 text-center">QTY</th>
              <th className="border border-black p-1 text-right">UNIT PRICE</th>
              <th className="border border-black p-1 text-right">TOTAL (Excl VAT)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border border-black p-1 align-top">{item.partNumber || ''}</td>
                <td className="border border-black p-1 align-top">{item.description}</td>
                <td className="border border-black p-1 align-top">{item.siteDisplay || 'N/A'}</td>
                <td className="border border-black p-1 text-center align-top">{item.uom}</td>
                <td className="border border-black p-1 text-center align-top">{item.quantity}</td>
                <td className="border border-black p-1 text-right align-top">{formatCurrency(item.unitPrice)}</td>
                <td className="border border-black p-1 text-right align-top">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
            {/* Add empty rows to fill space if needed, for visual consistency with a fixed-height table area */}
            {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                    <td className="border border-black p-1 h-6">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Totals Section */}
      <div className="flex justify-end mb-4">
        <div className="w-[250px] text-xs">
          <div className="flex justify-between border-b border-black py-0.5">
            <span>SUBTOTAL</span>
            <span>{formatCurrency(poData.subTotal)}</span>
          </div>
          <div className="flex justify-between border-b border-black py-0.5">
            <span>IVA (16%)</span>
            <span>
              {poData.currency === 'MZN' ? formatCurrency(poData.vatAmount) : (poData.pricesIncludeVat ? 'IVA Incl.' : 'N/A')}
            </span>
          </div>
          <div className="flex justify-between font-bold pt-0.5">
            <span>GRAND TOTAL</span>
            <span>{poData.currency} {formatCurrency(poData.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-xs pt-2 border-t-2 border-black">
        <div className="grid grid-cols-2 gap-x-4">
            <div>
                <div className="flex mb-1">
                    <span className="w-28">Prepared By</span><span>: {poData.creatorName || "System User (JMS)"}</span>
                </div>
                <div className="flex mb-1">
                    <span className="w-28">Requested By</span><span>: {poData.requestedByName || 'N/A'}</span>
                </div>
                <div className="flex mb-1">
                    <span className="w-28">Approved By</span><span>: {poData.approverName || (poData.approverId ? `Approver ID: ${poData.approverId}`: 'Pending')}</span>
                </div>
                 <div className="flex">
                    <span className="w-28">Date</span><span>: {poData.status === 'Approved' && approvalDate !== 'N/A' ? approvalDate : 'Pending Approval'}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <div className="h-8 w-48 border-b border-black mb-1 mt-8"></div>
                <p className="mr-[70px]">Signature</p>
            </div>
        </div>
      </div>
       {/* Optional: Add a small note about the company if needed, not in template but common */}
       {/* <p className="text-center text-[10px] text-gray-500 mt-6">
        {JACHRIS_COMPANY_DETAILS.name} - NUIT: {JACHRIS_COMPANY_DETAILS.nuit}
      </p> */}
    </div>
  );
}
