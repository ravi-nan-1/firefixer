'use server';

/**
 * @fileOverview Analyzes a user-provided file for issues based on a given XML definition.
 *
 * - analyzeFileForIssues -  A function that orchestrates the file analysis process.
 * - AnalyzeFileForIssuesInput - The input type for the analyzeFileForIssues function.
 * - AnalyzeFileForIssuesOutput - The return type for the analyzeFileForIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFileForIssuesInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to analyze.'),
  xmlDefinition: z.string().describe('The XML definition file content.'),
});
export type AnalyzeFileForIssuesInput = z.infer<typeof AnalyzeFileForIssuesInputSchema>;

const AnalyzeFileForIssuesOutputSchema = z.object({
  issues: z
    .array(z.string())
    .describe('A list of identified issues in the file based on the XML definition.'),
});
export type AnalyzeFileForIssuesOutput = z.infer<typeof AnalyzeFileForIssuesOutputSchema>;

export async function analyzeFileForIssues(input: AnalyzeFileForIssuesInput): Promise<AnalyzeFileForIssuesOutput> {
  return analyzeFileForIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFileForIssuesPrompt',
  input: {schema: AnalyzeFileForIssuesInputSchema},
  output: {schema: AnalyzeFileForIssuesOutputSchema},
  prompt: `You are an expert file analyzer. You will analyze the provided file content against the provided XML definition to identify any issues.

  File Content:
  {{fileContent}}

  XML Definition:
  {{xmlDefinition}}

  Identify any issues in the file content based on the rules and structure defined in the XML definition. List specific issues found. Return only identified issues, no additional text is needed.`,
});

const analyzeFileForIssuesFlow = ai.defineFlow(
  {
    name: 'analyzeFileForIssuesFlow',
    inputSchema: AnalyzeFileForIssuesInputSchema,
    outputSchema: AnalyzeFileForIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
