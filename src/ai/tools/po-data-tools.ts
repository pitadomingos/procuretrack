
'use server';
/**
 * @fileOverview Tools for fetching Purchase Order data for Genkit flows.
 * - getPurchaseOrdersTool: Fetches POs based on specified criteria.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { pool } from '../../../backend/db.js'; // Corrected path

// Input schema for the getPurchaseOrdersTool
const GetPurchaseOrdersInputSchema = z.object({
  startDate: z.string().optional().describe("Start date for PO creationDate (YYYY-MM-DD)"),
  endDate: z.string().optional().describe("End date for PO creationDate (YYYY-MM-DD)"),
  status: z.string().optional().describe("Filter by PO status (e.g., 'Approved', 'Pending Approval')"),
  supplierId: z.string().optional().describe("Filter by supplier ID (supplierCode)"),
  minGrandTotal: z.number().optional().describe("Minimum grand total value for POs"),
  maxGrandTotal: z.number().optional().describe("Maximum grand total value for POs"),
  limit: z.number().optional().default(50).describe("Max number of POs to return, default 50")
}).describe("Input for fetching purchase orders. All filters are optional.");

// Output schema for each PO returned by the tool
const PurchaseOrderToolOutputSchema = z.object({
  id: z.number(),
  poNumber: z.string(),
  creationDate: z.string().describe("PO creation date in YYYY-MM-DD format"),
  status: z.string(),
  supplierId: z.string().optional().nullable(),
  supplierName: z.string().optional().nullable().describe("Name of the supplier, if available"),
  grandTotal: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  requestedByName: z.string().optional().nullable(),
  itemCount: z.number().optional().describe("Number of items in this PO"),
});

// Tool definition
export const getPurchaseOrdersTool = ai.defineTool(
  {
    name: 'getPurchaseOrdersTool',
    description: 'Fetches purchase order data based on specified filters. Useful for analyzing PO trends, values, and statuses. Returns a list of purchase orders.',
    inputSchema: GetPurchaseOrdersInputSchema,
    outputSchema: z.array(PurchaseOrderToolOutputSchema),
  },
  async (input) => {
    console.log('[getPurchaseOrdersTool] Received input:', input);
    let connection;
    try {
      connection = await pool.getConnection();
      let query = `
        SELECT 
          po.id, 
          po.poNumber, 
          DATE_FORMAT(po.creationDate, '%Y-%m-%d') as creationDate, 
          po.status, 
          po.supplierId, 
          s.supplierName, 
          po.grandTotal, 
          po.currency, 
          po.requestedByName,
          (SELECT COUNT(*) FROM POItem poi WHERE poi.poId = po.id) as itemCount
        FROM PurchaseOrder po
        LEFT JOIN Supplier s ON po.supplierId = s.supplierCode
        WHERE 1=1
      `;
      const queryParams: (string | number)[] = [];

      if (input.startDate) {
        query += ' AND po.creationDate >= ?';
        queryParams.push(input.startDate);
      }
      if (input.endDate) {
        query += ' AND po.creationDate <= ?';
        queryParams.push(input.endDate);
      }
      if (input.status) {
        query += ' AND po.status = ?';
        queryParams.push(input.status);
      }
      if (input.supplierId) {
        query += ' AND po.supplierId = ?';
        queryParams.push(input.supplierId);
      }
      if (input.minGrandTotal !== undefined) {
        query += ' AND po.grandTotal >= ?';
        queryParams.push(input.minGrandTotal);
      }
      if (input.maxGrandTotal !== undefined) {
        query += ' AND po.grandTotal <= ?';
        queryParams.push(input.maxGrandTotal);
      }
      
      query += ' ORDER BY po.creationDate DESC LIMIT ?';
      queryParams.push(input.limit || 50);

      console.log('[getPurchaseOrdersTool] Executing query:', query, 'Params:', queryParams);
      const [rows] = await connection.execute(query, queryParams) as any[];
      console.log('[getPurchaseOrdersTool] Query successful, rows found:', rows.length);
      
      return rows.map(row => ({
        ...row,
        grandTotal: row.grandTotal ? parseFloat(row.grandTotal) : null,
        itemCount: parseInt(row.itemCount, 10) || 0,
      }));

    } catch (error: any) {
      console.error('[getPurchaseOrdersTool] Error fetching purchase orders:', error);
      // It's often better for the LLM to know an error occurred rather than getting empty data without context
      throw new Error(`Failed to fetch purchase orders from database: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }
);

