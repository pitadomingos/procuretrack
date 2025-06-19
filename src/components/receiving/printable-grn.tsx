
'use client';

import React from 'react';
import type { ConfirmedGRNDetails, ConfirmedGRNItemDetails } from '@/types';
import { format } from 'date-fns';

interface PrintableGRNProps {
  grnData: ConfirmedGRNDetails;
  logoDataUri?: string;
}

const JACHRIS_COMPANY_DETAILS = {
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  contactLine1: 'M: +258 85 545 8462 | +27 (0)11 813 4009',
  address: 'Quinta do Bom Sol, Bairro Chithatha, Moatize, Mozambique',
  website: 'www.jachris.com',
  logoUrl: '/jachris-logo.png', // Default path if logoDataUri not provided
};

export function PrintableGRN({ grnData, logoDataUri }: PrintableGRNProps) {
  const currentLogoSrc = logoDataUri || JACHRIS_COMPANY_DETAILS.logoUrl;
  const grnDateFormatted = grnData.grnDate ? format(new Date(grnData.grnDate), 'dd MMM yyyy') : 'N/A';

  return (
    <div className="bg-white p-6 font-sans text-sm print:text-xs" style={{ fontFamily: "'Arial', sans-serif", color: '#333' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-700">
        <div>
          <h1 className="text-2xl print:text-xl font-bold text-red-700">{JACHRIS_COMPANY_DETAILS.name}</h1>
          <p className="text-xs">{JACHRIS_COMPANY_DETAILS.contactLine1}</p>
          <p className="text-xs">{JACHRIS_COMPANY_DETAILS.address}</p>
        </div>
        <div className="text-right">
          <img src={currentLogoSrc} alt="JACHRIS Logo" className="h-16 print:h-12 mb-2 ml-auto" data-ai-hint="company brand logo"/>
          <h2 className="text-3xl print:text-2xl font-bold text-gray-700">GOODS RECEIVED NOTE</h2>
        </div>
      </div>

      {/* GRN Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div>
          <p><strong className="text-gray-600">GRN No.:</strong> {grnData.grnNumber || 'PENDING_GRN_ID'}</p>
          <p><strong className="text-gray-600">GRN Date:</strong> {grnDateFormatted}</p>
          <p><strong className="text-gray-600">Supplier:</strong> {grnData.supplierName || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p><strong className="text-gray-600">Original PO No.:</strong> {grnData.poNumber}</p>
          <p><strong className="text-gray-600">Supplier Delivery Note:</strong> {grnData.deliveryNoteNumber || 'N/A'}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 min-h-[300px] print:min-h-[auto]">
        <table className="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border border-gray-400 p-2 text-left">Part No.</th>
              <th className="border border-gray-400 p-2 text-left w-2/5">Item Description</th>
              <th className="border border-gray-400 p-2 text-left">Site</th>
              <th className="border border-gray-400 p-2 text-center">UOM</th>
              <th className="border border-gray-400 p-2 text-right">Ordered</th>
              <th className="border border-gray-400 p-2 text-right">Prev. Rec.</th>
              <th className="border border-gray-400 p-2 text-right">Received Now</th>
              <th className="border border-gray-400 p-2 text-right">Outstanding</th>
              <th className="border border-gray-400 p-2 text-left">Item Notes</th>
            </tr>
          </thead>
          <tbody>
            {grnData.items.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border border-gray-400 p-1 print:p-0.5 align-top">{item.partNumber || ''}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 align-top">{item.description}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 align-top">{item.siteDisplay || 'N/A'}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 text-center align-top">{item.uom}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 text-right align-top">{item.quantityOrdered}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 text-right align-top">{item.quantityPreviouslyReceived}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 text-right align-top font-semibold">{item.quantityReceivedThisGRN}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 text-right align-top">{item.quantityOutstandingAfterGRN}</td>
                <td className="border border-gray-400 p-1 print:p-0.5 align-top">{item.itemSpecificNotes || ''}</td>
              </tr>
            ))}
            {/* Fill empty rows for consistent table height on screen */}
            {Array.from({ length: Math.max(0, 8 - grnData.items.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="print:hidden">
                    <td className="border border-gray-400 p-1 print:p-0.5 h-6">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                    <td className="border border-gray-400 p-1 print:p-0.5">&nbsp;</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Overall Notes */}
      {grnData.overallGrnNotes && (
        <div className="mb-6 text-xs">
          <h4 className="font-bold text-gray-600 mb-1">Overall GRN Notes:</h4>
          <p className="border border-gray-300 p-2 min-h-[40px] bg-gray-50 whitespace-pre-wrap break-words">
            {grnData.overallGrnNotes}
          </p>
        </div>
      )}

      {/* Signatures */}
      <div className="text-xs pt-6 border-t-2 border-gray-700 mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="mb-1"><strong className="text-gray-600">Received By:</strong> {grnData.receivedByUser}</p>
          <div className="mt-8 border-b border-gray-500 w-full"></div>
          <p className="text-center">Signature & Date</p>
        </div>
        <div>
          <p className="mb-1"><strong className="text-gray-600">Checked By (Jachris):</strong></p>
          <div className="mt-8 border-b border-gray-500 w-full"></div>
          <p className="text-center">Signature & Date</p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-8 print:mt-4">
        This document confirms receipt of the goods listed above in good order and condition unless otherwise noted.
      </p>
    </div>
  );
}
