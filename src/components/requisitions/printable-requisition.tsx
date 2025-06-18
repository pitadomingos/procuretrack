
import React from 'react';
import type { RequisitionPayload, RequisitionItem } from '@/types';

interface PrintableRequisitionProps {
  requisitionData: RequisitionPayload;
  logoDataUri?: string; 
}

const JACHRIS_COMPANY_DETAILS = { 
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  logoUrl: '/jachris-logo.png',
};

export function PrintableRequisition({ requisitionData, logoDataUri }: PrintableRequisitionProps) {
  const { items } = requisitionData;

  const requisitionDateFormatted = requisitionData.requisitionDate 
    ? new Date(requisitionData.requisitionDate).toLocaleDateString('en-GB') 
    : 'N/A';
  const approvalDateFormatted = requisitionData.approvalDate
    ? new Date(requisitionData.approvalDate).toLocaleDateString('en-GB')
    : 'N/A';
  const currentLogoSrc = logoDataUri || JACHRIS_COMPANY_DETAILS.logoUrl;

  const siteName = requisitionData.siteName || (requisitionData.siteId ? `Site ID: ${requisitionData.siteId}`: 'N/A');

  const printableItems = (items || []) as (Omit<RequisitionItem, 'estimatedUnitPrice'> & {categoryName?: string, siteId?: number | null})[];

  return (
    <div className="bg-white p-6 font-sans text-sm" style={{ fontFamily: "'Arial', sans-serif", color: '#333' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-700">
        <div>
          <img src={currentLogoSrc} alt="JACHRIS Logo" className="h-16 mb-2" data-ai-hint="company brand logo" />
          <h1 className="text-xl font-bold text-red-700">{JACHRIS_COMPANY_DETAILS.name}</h1>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-700">PURCHASE REQUISITION</h2>
          <p className="text-lg mt-1">No: <span className="font-semibold">{requisitionData.requisitionNumber}</span></p>
        </div>
      </div>

      {/* Requisition Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div>
          <p><strong className="text-gray-600">Date:</strong> {requisitionDateFormatted}</p>
          <p><strong className="text-gray-600">Requested By:</strong> {requisitionData.requestedByName || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p><strong className="text-gray-600">Site/Department:</strong> {siteName}</p>
          <p><strong className="text-gray-600">Status:</strong> <span className="font-semibold">{requisitionData.status}</span></p>
        </div>
      </div>
      
      {requisitionData.justification && (
        <div className="mb-6 text-xs">
            <h3 className="font-bold text-gray-600 mb-1">JUSTIFICATION:</h3>
            <p className="border border-gray-300 p-2 min-h-[60px] bg-gray-50 whitespace-pre-wrap break-words">
              {requisitionData.justification}
            </p>
        </div>
      )}

      {/* Items Table */}
      <div className="mb-6 min-h-[250px]">
        <table className="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border border-gray-400 p-2 text-left">PART NUMBER</th>
              <th className="border border-gray-400 p-2 text-left w-2/5">ITEM / SERVICE DESCRIPTION</th>
              <th className="border border-gray-400 p-2 text-left">CATEGORY</th>
              <th className="border border-gray-400 p-2 text-left">ITEM SITE</th>
              <th className="border border-gray-400 p-2 text-center">QTY</th>
              <th className="border border-gray-400 p-2 text-left">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {printableItems.map((item, index) => {
              const categoryName = item.categoryName || (item.categoryId ? `Cat. ID: ${item.categoryId}` : 'N/A');
              // Find site name/code for item
              const itemSite = requisitionData.siteId === item.siteId // Check if item site is same as header
                ? siteName // Use header site name if same
                : (item.siteId ? `Site ID: ${item.siteId}` : 'N/A'); // Fallback or show different item site
              return (
                <tr key={item.id || index}>
                  <td className="border border-gray-400 p-2 align-top">{item.partNumber || ''}</td>
                  <td className="border border-gray-400 p-2 align-top">{item.description}</td>
                  <td className="border border-gray-400 p-2 align-top">{categoryName}</td>
                  <td className="border border-gray-400 p-2 align-top">{itemSite}</td>
                  <td className="border border-gray-400 p-2 text-center align-top">{item.quantity}</td>
                  <td className="border border-gray-400 p-2 align-top">{item.notes || ''}</td>
                </tr>
              );
            })}
            {Array.from({ length: Math.max(0, 8 - printableItems.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                    <td className="border border-gray-400 p-2 h-7">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures / Approval Section */}
      <div className="text-xs pt-4 border-t-2 border-gray-700 mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1"><strong className="text-gray-600">Requested By:</strong></p>
          <p className="font-semibold">{requisitionData.requestedByName || 'N/A'}</p>
          <div className="mt-8 border-b border-black w-4/5"></div>
          <p className="text-xs">Signature & Date</p>
        </div>
        <div>
          <p className="mb-1"><strong className="text-gray-600">Approved By:</strong></p>
          <p className="font-semibold">{requisitionData.approverName || (requisitionData.status === 'Pending Approval' ? '(Pending Approval)' : (requisitionData.status === 'Approved' ? 'Approved (Name Missing)' : 'N/A'))}</p>
          {requisitionData.status === 'Approved' && requisitionData.approvalDate && (
            <p className="text-xs">Date: {approvalDateFormatted}</p>
          )}
          <div className="mt-8 border-b border-black w-4/5"></div>
          <p className="text-xs">Signature & Date</p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-8">Internal Document - Not for External Distribution</p>
    </div>
  );
}
