
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { PrintablePO } from '@/components/purchase-orders/printable-po';
import type { PurchaseOrderPayload } from '@/types';

export function renderPoToHtml(poData: PurchaseOrderPayload, logoDataUri?: string): string {
  // PrintablePO is a shared component (no 'use client' or 'use server' directive),
  // suitable for server-side rendering to a string.
  return ReactDOMServer.renderToString(
    React.createElement(PrintablePO, { poData, logoDataUri })
  );
}
