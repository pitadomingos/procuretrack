
'use server';
/**
 * @fileOverview A Genkit flow for analyzing Purchase Order data based on user prompts.
 * - analyzePurchaseOrders: Main function to call the flow.
 * - POAnalysisInput: Input type for the flow.
 * - POAnalysisOutput: Output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getPurchaseOrdersTool } from '../tools/po-data-tools';
import type { GenkitErrorCode, ToolRequest, ToolResponse } from 'genkit'; // Import types for history


// Input schema for the flow
export const POAnalysisInputSchema = z.object({
  prompt: z.string().describe("The user's natural language question or request about Purchase Orders."),
});
export type POAnalysisInput = z.infer<typeof POAnalysisInputSchema>;

// Output schema for the flow
export const POAnalysisOutputSchema = z.object({
  responseText: z.string().describe("The textual summary or answer to the user's prompt."),
  chartData: z.array(z.object({ name: z.string(), value: z.number() })).optional().describe("Optional data for a simple bar chart if applicable (e.g., {name: 'Supplier A', value: 12000}). 'name' is the bar label, 'value' is the bar height."),
  chartTitle: z.string().optional().describe("Title for the chart if chartData is provided."),
  debugInfo: z.string().optional().describe("Debugging information, like data fetched by tools."),
});
export type POAnalysisOutput = z.infer<typeof POAnalysisOutputSchema>;

// Define the main prompt for the Gemini model
const poAnalysisSystemPrompt = ai.definePrompt({
  name: 'poAnalysisSystemPrompt',
  input: { schema: POAnalysisInputSchema },
  output: { schema: POAnalysisOutputSchema },
  tools: [getPurchaseOrdersTool],
  prompt: `You are an expert data analyst specializing in Purchase Orders (POs) for a company named Jachris.
The user will provide a question or request in natural language. Your goal is to answer the user's question using data from the available tools.

Available tools:
- getPurchaseOrdersTool: Fetches purchase order data. You can specify filters like date ranges (YYYY-MM-DD), status (e.g., 'Approved', 'Pending Approval', 'Completed', 'Rejected', 'Draft'), supplier ID (supplierCode), and grand total value ranges. It returns a list of POs including fields like poNumber, creationDate, status, supplierName, grandTotal, currency, requestedByName, itemCount.

Based on the user's prompt:
1.  Understand the user's request. Identify key entities, metrics, and timeframes they are interested in.
2.  Determine what data you need from the Purchase Orders.
3.  Use the 'getPurchaseOrdersTool' to fetch this data. You might need to call it appropriately to get the data to answer the question. Be efficient but comprehensive.
4.  Analyze the retrieved data to answer the user's question. Perform calculations like sums, averages, counts if needed.
5.  Provide a clear, concise textual response in the 'responseText' field. Address the user's query directly. If data is not found, state that clearly.
6.  If the user's query implies an aggregation or comparison that can be visualized as a simple bar chart (e.g., total PO value per supplier, count of POs by status for a period, POs count per month), provide the data for this chart in the 'chartData' field. 'chartData' should be an array of objects, each with a 'name' (string, for the bar label like supplier name or status) and a 'value' (number, for the bar height like total value or count). Also, provide a suitable 'chartTitle'.
7.  If no chart is appropriate or if the data is insufficient for a meaningful chart, omit 'chartData' and 'chartTitle'.
8.  Current year is ${new Date().getFullYear()}. If the user asks for "this year" or "last month" make sure to calculate the date ranges correctly.
9.  Focus on providing specific numbers and insights rather than generic statements.
10. If you use the tool, briefly mention what data you fetched in the 'debugInfo' field, e.g., "Fetched 10 POs for supplier X in Q1 2024." This is for debugging.

User's request: {{{prompt}}}
`,
});


// Define the Genkit flow
const poAnalysisFlow = ai.defineFlow(
  {
    name: 'poAnalysisFlow',
    inputSchema: POAnalysisInputSchema,
    outputSchema: POAnalysisOutputSchema,
  },
  async (input) => {
    console.log('[poAnalysisFlow] Received input:', input);
    let llmOutput: POAnalysisOutput | undefined;
    let llmHistory: Array<{type: string, request?: ToolRequest, response?: ToolResponse<any, GenkitErrorCode>}> | undefined;
    let flowError: string | undefined;

    try {
      const { output, history } = await poAnalysisSystemPrompt(input);
      llmOutput = output;
      llmHistory = history as any; // Cast to more specific type if Genkit provides one for history events

      if (!llmOutput) {
        console.warn('[poAnalysisFlow] LLM returned no output, but no error was thrown during generation.');
        flowError = 'AI model returned an empty output.';
      }
    } catch (e: any) {
      console.error('[poAnalysisFlow] Error during LLM prompt execution or tool call:', e);
      flowError = `Error processing AI request: ${e.message || String(e)}`;
      // Attempt to get history even if the main call failed, it might contain tool request/response attempts.
      if (e.history) {
        llmHistory = e.history;
      }
    }

    let debugMessages: string[] = [];
    if (llmHistory) {
      llmHistory.forEach(event => {
        if (event.type === 'toolRequest' && event.request) {
          debugMessages.push(`Tool Request: ${event.request.name} with input ${JSON.stringify(event.request.input).substring(0,100)}...`);
        }
        if (event.type === 'toolResponse' && event.response) {
          const output = event.response.output;
          let responseSummary = `Tool Response: ${event.response.name} `;
          if (event.response.error) {
            responseSummary += `returned an error: ${event.response.error.message} (Code: ${event.response.error.code || 'N/A'})`;
          } else if (output && Array.isArray(output)) {
            responseSummary += `returned data (count: ${output.length}).`;
          } else if (output) {
            responseSummary += `returned non-array data: ${JSON.stringify(output).substring(0,100)}...`;
          } else {
            responseSummary += 'returned no specific output or error in response object.';
          }
          debugMessages.push(responseSummary);
        }
      });
    }
    
    const finalDebugInfo = debugMessages.join('\n');

    if (flowError) {
      return {
        responseText: `An error occurred: ${flowError}`,
        debugInfo: finalDebugInfo || flowError, 
      };
    }
    
    if (!llmOutput) {
        console.error('[poAnalysisFlow] LLM output is unexpectedly null/undefined after processing, and no flowError was set.');
        return {
            responseText: 'AI model did not produce a valid output. Please check server logs.',
            debugInfo: finalDebugInfo || 'No debug information. Output was unexpectedly null.',
        };
    }

    console.log('[poAnalysisFlow] Successfully processed. LLM Output:', llmOutput);
    return {
      ...llmOutput,
      // Prepend history debug messages to any debug info the LLM might have generated itself.
      debugInfo: finalDebugInfo ? `${finalDebugInfo}\n${llmOutput.debugInfo || ''}`.trim() : llmOutput.debugInfo,
    };
  }
);

// Exported wrapper function to be called from API routes or server actions
export async function analyzePurchaseOrders(input: POAnalysisInput): Promise<POAnalysisOutput> {
  return poAnalysisFlow(input);
}
