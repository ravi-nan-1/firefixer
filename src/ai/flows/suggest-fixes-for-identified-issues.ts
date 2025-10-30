'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest fixes for identified issues in a file,
 * leveraging information from an XML definition file.
 *
 * - suggestFixesForIdentifiedIssues - A function that accepts a file's content, an XML definition,
 *   and a list of identified issues, and returns suggestions for fixing those issues.
 * - SuggestFixesInput - The input type for the suggestFixesForIdentifiedIssues function.
 * - SuggestFixesOutput - The return type for the suggestFixesForIdentifiedIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixesInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to be analyzed.'),
  xmlDefinition: z.string().describe('The XML definition file describing file content rules.'),
  identifiedIssues: z.string().describe('The identified issues in the file.'),
});
export type SuggestFixesInput = z.infer<typeof SuggestFixesInputSchema>;

const SuggestFixesOutputSchema = z.object({
  fixSuggestions: z.string().describe('Suggestions on how to fix the identified issues.'),
});
export type SuggestFixesOutput = z.infer<typeof SuggestFixesOutputSchema>;

export async function suggestFixesForIdentifiedIssues(
  input: SuggestFixesInput
): Promise<SuggestFixesOutput> {
  return suggestFixesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFixesPrompt',
  input: {schema: SuggestFixesInputSchema},
  output: {schema: SuggestFixesOutputSchema},
  prompt: `You are an expert file analyst. Given the content of a file, an XML definition describing the file's expected structure and rules, and a list of identified issues, you will provide suggestions on how to fix each issue.

File Content:
{{fileContent}}

XML Definition:
{{xmlDefinition}}

Identified Issues:
{{identifiedIssues}}

Provide clear and concise suggestions for fixing each identified issue, referencing the XML definition where appropriate.`,
});

const suggestFixesFlow = ai.defineFlow(
  {
    name: 'suggestFixesFlow',
    inputSchema: SuggestFixesInputSchema,
    outputSchema: SuggestFixesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
