
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
const POAnalysisInputSchema = z.object({
  prompt: z.string().describe("The user's natural language question or request about Purchase Orders."),
});
export type POAnalysisInput = z.infer<typeof POAnalysisInputSchema>;

// Output schema for the flow
const POAnalysisOutputSchema = z.object({
  responseText: z.string().describe("The textual summary or answer to the user's prompt."),
  chartData: z.array(z.object({ name: z.string(), value: z.number() })).optional().describe("Optional data for a simple bar chart if applicable (e.g., {name: 'Supplier A', value: 12000}). 'name' is the bar label, 'value' is the bar height."),
  chartTitle: z.string().nullable().optional().describe("Title for the chart if chartData is provided. Omit or set to null if no chart is generated."),
  debugInfo: z.string().describe("Debugging information, like data fetched by tools. This is a mandatory field."),
});
export type POAnalysisOutput = z.infer<typeof POAnalysisOutputSchema>;

// Define the main prompt for the Gemini model
const poAnalysisSystemPrompt = ai.definePrompt({
  name: 'poAnalysisSystemPrompt',
  input: { schema: POAnalysisInputSchema },
  output: { schema: POAnalysisOutputSchema },
  tools: [getPurchaseOrdersTool],
  prompt: `You are a data analyst for a company named Jachris. Your ONLY task is to answer questions about Purchase Order (PO) data by using the provided tools.

**CRITICAL INSTRUCTIONS:**
1.  **EXCLUSIVE DATA SOURCE:** You **MUST** use the 'getPurchaseOrdersTool' to fetch any data you need. Do not use any prior knowledge or make up information.
2.  **NO HALLUCINATION:** Base your entire answer **exclusively** on the data returned by the tool. If the tool returns no data or an empty array, you **MUST** state that no records were found matching the criteria, and 'chartData' must be an empty array. Do not invent suppliers, amounts, dates, or currencies.
3.  **CURRENCY:** Use the currency symbol (e.g., MZN, USD) provided in the 'currency' field of the data for all monetary values in your response. Do not assume a currency if it is not present in the data.
4.  **CHARTING:** If the user asks for a visual breakdown or a chart is appropriate, populate 'chartData'. If 'chartData' is populated, you **MUST** provide a descriptive 'chartTitle'. If no chart is generated, 'chartData' MUST be an empty array and 'chartTitle' MUST be omitted or set to null.
5.  **DEBUGGING (MANDATORY):** You **MUST** populate the 'debugInfo' field. Summarize which tool you called, what filters you used, and how many records it returned. If no tool was called, explain why. Example: "Tool 'getPurchaseOrdersTool' was called with filters: {status: 'Approved'}. It returned 15 PO records."

**Your Process:**
1.  **Analyze User Request:** Determine what filters are needed for the 'getPurchaseOrdersTool'.
2.  **Call Tool:** Execute the 'getPurchaseOrdersTool' with the determined filters.
3.  **Analyze Tool Output:** Use the JSON data returned from the tool to construct your answer.
4.  **Format Final Output:** Generate a single JSON object matching the required output schema.

**Current Date for Context:** ${new Date().toISOString().split('T')[0]}

**User's request:** {{{prompt}}}
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
    try {
        const { output } = await poAnalysisSystemPrompt(input);

        if (!output) {
          console.error('[poAnalysisFlow] LLM returned a null or undefined output. This can happen if the model response does not conform to the output schema.');
          throw new Error('The AI model failed to produce a valid response. Please try rephrasing your question.');
        }
        
        console.log('[poAnalysisFlow] Successfully processed. LLM Output:', JSON.stringify(output).substring(0, 500) + "...");
        return output;

    } catch (error: any) {
        console.error("[poAnalysisFlow] An error occurred during flow execution:", error);
        // This catch block handles errors from the tool (e.g., DB connection) or the LLM call itself.
        // It formats the error into the expected output structure.
        return {
            responseText: `An error occurred while analyzing the data: ${error.message || 'Unknown error'}. Please check the system logs or try again.`,
            debugInfo: `Error caught in poAnalysisFlow: ${error.stack || error.message}`,
        };
    }
  }
);

// Exported wrapper function to be called from API routes or server actions
export async function analyzePurchaseOrders(input: POAnalysisInput): Promise<POAnalysisOutput> {
  return poAnalysisFlow(input);
}
