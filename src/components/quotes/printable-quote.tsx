
import React from 'react';
import type { QuotePayload, QuoteItem } from '@/types';

interface PrintableQuoteProps {
  quoteData: QuotePayload;
  logoDataUri?: string; // Same as PrintablePO
}

const JACHRIS_COMPANY_DETAILS = {
  name: 'JACHRIS MOZAMBIQUE (LTD)',
  contactLine1: 'M: +258 85 545 8462 | +27 (0)11 813 4009',
  address: 'Quinta do Bom Sol, Bairro Chithatha, Moatize, Mozambique',
  website: 'www.jachris.com',
  logoUrl: '/jachris-logo.png', 
  nuit: '400 415 954', // Jachris NUIT
};

export function PrintableQuote({ quoteData, logoDataUri }: PrintableQuoteProps) {
  const { clientName, clientEmail, items } = quoteData;

  const quoteDateFormatted = quoteData.quoteDate ? new Date(quoteData.quoteDate).toLocaleDateString('en-GB') : 'N/A';
  const currentLogoSrc = logoDataUri || JACHRIS_COMPANY_DETAILS.logoUrl;

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0.00';
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const printableItems = (items || []) as QuoteItem[];

  return (
    <div className="bg-white p-6 font-sans text-sm" style={{ fontFamily: "'Arial', sans-serif", color: '#333' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-red-700">{JACHRIS_COMPANY_DETAILS.name}</h1>
          <p className="text-xs">{JACHRIS_COMPANY_DETAILS.contactLine1}</p>
          <p className="text-xs">{JACHRIS_COMPANY_DETAILS.address}</p>
          <p className="text-xs text-red-700">{JACHRIS_COMPANY_DETAILS.website}</p>
          <p className="text-xs">NUIT: {JACHRIS_COMPANY_DETAILS.nuit}</p>
        </div>
        <div className="text-right">
          <img src={currentLogoSrc} alt="JACHRIS Logo" className="h-16 mb-2 ml-auto" data-ai-hint="company brand logo" />
          <h2 className="text-3xl font-bold text-gray-700">QUOTATION</h2>
        </div>
      </div>

      {/* Quote Info & Client Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div>
          <h3 className="font-bold text-gray-600 mb-1">CLIENT DETAILS:</h3>
          <p><strong>{clientName || 'N/A'}</strong></p>
          <p>{quoteData.clientId ? `Client ID: ${quoteData.clientId}` : ''}</p>
          <p>{clientEmail || 'N/A'}</p>
          {/* Add more client details from quoteData.client if available (e.g., address, contact person) */}
        </div>
        <div className="text-right">
          <p><strong className="text-gray-600">Quote No.:</strong> {quoteData.quoteNumber}</p>
          <p><strong className="text-gray-600">Date:</strong> {quoteDateFormatted}</p>
          <p><strong className="text-gray-600">Currency:</strong> {quoteData.currency}</p>
          <p><strong className="text-gray-600">Status:</strong> <span className="font-semibold">{quoteData.status || 'Draft'}</span></p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 min-h-[250px]">
        <table className="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border border-gray-400 p-2 text-left">ITEM / SERVICE DESCRIPTION</th>
              <th className="border border-gray-400 p-2 text-center">QTY</th>
              <th className="border border-gray-400 p-2 text-right">UNIT PRICE</th>
              <th className="border border-gray-400 p-2 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {printableItems.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border border-gray-400 p-2 align-top">{item.description}</td>
                <td className="border border-gray-400 p-2 text-center align-top">{item.quantity}</td>
                <td className="border border-gray-400 p-2 text-right align-top">{formatCurrency(item.unitPrice)}</td>
                <td className="border border-gray-400 p-2 text-right align-top">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
            {/* Fill empty rows for consistent table height */}
            {Array.from({ length: Math.max(0, 8 - printableItems.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                    <td className="border border-gray-400 p-2 h-7">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Notes/Terms */}
      <div className="flex justify-between mb-6 items-start text-xs">
        <div className="w-3/5 pr-4">
          {quoteData.notes && (
            <>
              <h4 className="font-bold text-gray-600 mb-1">NOTES:</h4>
              <p className="border border-gray-300 p-2 min-h-[50px] bg-gray-50 whitespace-pre-wrap break-words">
                {quoteData.notes}
              </p>
            </>
          )}
           {quoteData.termsAndConditions && (
            <div className="mt-3">
              <h4 className="font-bold text-gray-600 mb-1">TERMS & CONDITIONS:</h4>
              <p className="border border-gray-300 p-2 min-h-[50px] bg-gray-50 whitespace-pre-wrap break-words">
                {quoteData.termsAndConditions}
              </p>
            </div>
          )}
        </div>
        <div className="w-2/5 text-xs">
          <div className="border-t border-gray-300 pt-1">
            <div className="flex justify-between py-1">
              <span>SUBTOTAL</span>
              <span className="font-semibold">{quoteData.currency} {formatCurrency(quoteData.subTotal)}</span>
            </div>
            {quoteData.vatAmount > 0 && (
              <div className="flex justify-between py-1 border-t border-gray-200">
                <span>VAT (16%)</span> 
                <span className="font-semibold">{quoteData.currency} {formatCurrency(quoteData.vatAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1 mt-1 border-t-2 border-gray-700">
              <span>GRAND TOTAL</span>
              <span>{quoteData.currency} {formatCurrency(quoteData.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Prepared By */}
      <div className="text-xs pt-4 border-t-2 border-gray-700 mt-6">
        <p className="mb-1">Prepared By: <strong>Jachris Mozambique Lda Sales Team</strong></p>
        <p>Email: <span className="text-red-700">sales.moz@jachris.com</span> | Contact: See Header</p>
        <p className="mt-4 text-center text-gray-500">Thank you for your business!</p>
      </div>
    </div>
  );
}
