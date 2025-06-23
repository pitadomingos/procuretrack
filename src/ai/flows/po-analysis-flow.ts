
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
  system: `You are an expert data analyst specializing in Purchase Orders (POs) for a company named Jachris.
Your goal is to answer the user's question by fetching data using the available tools and then analyzing it.

Available tools:
- getPurchaseOrdersTool: Fetches purchase order data. You can filter by criteria like date ranges (YYYY-MM-DD format), status, supplier, and value. It returns a list of POs with details like poNumber, creationDate, status, supplierName, grandTotal, currency, requestedByName, and itemCount.

Your Process:
1.  **Analyze Request**: Understand the user's request to determine what data is needed.
2.  **Use Tools**: Call the 'getPurchaseOrdersTool' with the necessary filters to retrieve the data.
3.  **Synthesize Answer**: Analyze the data returned by the tool to form your answer.
4.  **Format Output**: Structure your entire response as a single JSON object matching the requested schema.

Output Requirements:
- \`responseText\`: Provide a clear, concise textual response that directly answers the user's query. If no data is found, state that clearly.
- \`chartData\` (optional): If the query involves aggregation (e.g., total PO value per supplier, count of POs by status), provide data for a bar chart. Each object in the array should have a 'name' (string label for the bar) and a 'value' (numeric value for the bar).
- \`chartTitle\` (optional): Provide a title for the chart if \`chartData\` is present.
- \`debugInfo\` (optional): **Crucially, if you use a tool, you MUST summarize what you did.** For example: "Tool 'getPurchaseOrdersTool' was called with filters: {status: 'Approved', startDate: '2024-01-01'}. It returned 15 PO records."

Important Context:
- The current year is ${new Date().getFullYear()}. Calculate date ranges for "this year" or "last month" accordingly.
- Be specific with numbers and insights.

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
  async (input): Promise<POAnalysisOutput> => {
    console.log('[poAnalysisFlow] Received input:', input);

    const { output } = await poAnalysisSystemPrompt(input);

    if (!output) {
      console.error('[poAnalysisFlow] LLM returned a null or undefined output. This can happen if the model response does not conform to the output schema.');
      throw new Error('The AI model failed to produce a valid response. Please try rephrasing your question.');
    }
    
    console.log('[poAnalysisFlow] Successfully processed. LLM Output:', JSON.stringify(output).substring(0, 500) + "...");

    return output;
  }
);

// Exported wrapper function to be called from API routes or server actions
export async function analyzePurchaseOrders(input: POAnalysisInput): Promise<POAnalysisOutput> {
  return poAnalysisFlow(input);
}
