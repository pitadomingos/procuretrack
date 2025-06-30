
import React from 'react';
import type { PurchaseOrderPayload, POItemForPrint } from '@/types';

interface PrintablePOProps {
  poData: PurchaseOrderPayload;
  logoDataUri?: string;
}

const JACHRIS_COMPANY_DETAILS = {
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  contactLine1: 'M: +258 85 545 8462 | +27 (0)11 813 4009',
  address: 'Quinta do Bom Sol, Bairro Chithatha, Moatize, Mozambique',
  website: 'www.jachris.com',
  logoUrl: '/jachris-logo.png',
  nuit: '400 415 954',
};


export function PrintablePO({ poData, logoDataUri }: PrintablePOProps) {
  const { supplierDetails, items, approverName, approverSignatureUrl, status } = poData;

  const poCreationDate = poData.creationDate ? new Date(poData.creationDate).toLocaleDateString('en-GB') : 'N/A';
  const approvalDate = poData.approvalDate ? new Date(poData.approvalDate).toLocaleDateString('en-GB') : 'N/A';

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0.00';
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const printableItems = (items || []) as POItemForPrint[];
  const currentLogoSrc = logoDataUri || JACHRIS_COMPANY_DETAILS.logoUrl;

  return (
    <div className="printable-document-wrapper">
      <div className="printable-document-main-content">
        <div className="bg-white p-4 font-sans text-xs" style={{ fontFamily: "'Arial', sans-serif" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-lg font-bold text-red-700">{JACHRIS_COMPANY_DETAILS.name}</h1>
              <p>{JACHRIS_COMPANY_DETAILS.contactLine1}</p>
              <p>{JACHRIS_COMPANY_DETAILS.address}</p>
              <p className="text-red-700">{JACHRIS_COMPANY_DETAILS.website}</p>
            </div>
            <div className="text-right">
              <img
                src={currentLogoSrc}
                alt="JACHRIS Logo"
                className="h-12 mb-1 ml-auto"
                data-ai-hint="company brand logo"
                 />
              <h2 className="text-xl font-bold">Purchase Order</h2>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2 pb-1 border-b-2 border-black">
            <span className="text-lg font-bold text-red-700">{poData.poNumber}</span>
            <span className="text-sm"><strong>Date:</strong> {poCreationDate}</span>
          </div>

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

          <div className="mb-1 min-h-[300px]">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1 text-left">PART NUMBER</th>
                  <th className="border border-black p-1 text-left">DESCRIPTION</th>
                  <th className="border border-black p-1 text-left">ALLOCATION</th>
                  <th className="border border-black p-1 text-center">UNIT</th>
                  <th className="border border-black p-1 text-center">QTY ORD.</th>
                  <th className="border border-black p-1 text-right">UNIT PRICE</th>
                  <th className="border border-black p-1 text-right">TOTAL (Excl VAT)</th>
                </tr>
              </thead>
              <tbody>
                {printableItems.map((item, index) => (
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
                {Array.from({ length: Math.max(0, 10 - printableItems.length) }).map((_, i) => (
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
        </div>
      </div>
      <div className="printable-document-footer bg-white p-4 font-sans text-xs" style={{ fontFamily: "'Arial', sans-serif" }}>
        <div className="flex justify-between mb-4 items-start">
          <div className="w-2/3 pr-4">
              <h4 className="font-bold mb-1">NOTES:</h4>
              {poData.notes ? (
                <p className="text-xs border border-black p-2 min-h-[60px] whitespace-pre-wrap break-words">
                  {poData.notes}
                </p>
              ) : (
                <p className="text-xs border border-black p-2 min-h-[60px] text-gray-500 italic">
                  No notes provided.
                </p>
              )}
          </div>
          <div className="w-1/3 text-xs">
            <div className="flex justify-between border-b border-black py-0.5">
              <span>SUBTOTAL</span>
              <span>{formatCurrency(poData.subTotal)}</span>
            </div>
            <div className="flex justify-between border-b border-black py-0.5">
              <span>IVA (16%)</span>
              <span>
                {poData.currency === 'MZN' && !poData.pricesIncludeVat ? formatCurrency(poData.vatAmount) : (poData.pricesIncludeVat ? 'IVA Incl.' : 'N/A')}
              </span>
            </div>
            <div className="flex justify-between font-bold pt-0.5">
              <span>GRAND TOTAL</span>
              <span>{poData.currency} {formatCurrency(poData.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="text-xs pt-2 border-t-2 border-black">
          <h4 className="font-bold mb-2">Authorisation:</h4>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-1"><strong>Requested By:</strong></p>
              <p>{poData.requestedByName || poData.creatorName || 'N/A'}</p>
              <div className="mt-8 border-b border-black w-4/5"></div>
              <p className="text-center w-4/5">Requester Signature</p>
            </div>
            <div>
              <p className="mb-1"><strong>Approved By:</strong></p>
              <p className="font-semibold h-4">{status === 'Approved' ? (approverName || 'Approved') : `(${status || 'N/A'})`}</p>
              {status === 'Approved' && approverSignatureUrl && (
                <div className="mt-1 h-12 w-28">
                  <img 
                    src={approverSignatureUrl} 
                    alt={`${approverName || 'Approver'}'s signature`} 
                    className="max-h-full max-w-full object-contain"
                    data-ai-hint="signature image"
                  />
                </div>
              )}
              {status === 'Approved' && <p className="text-xs mt-1">Date: {approvalDate}</p>}
              <div className="mt-2 border-b border-black w-4/5"></div>
              <p className="text-center w-4/5">Approver Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
