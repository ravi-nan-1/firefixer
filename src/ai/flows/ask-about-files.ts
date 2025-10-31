'use server';
/**
 * @fileOverview This file defines a Genkit flow to answer questions about a file
 * based on its content and an XML definition.
 *
 * - askAboutFiles - A function that takes file content, XML definition, and a question,
 *   and returns an answer.
 * - AskAboutFilesInput - The input type for the askAboutFiles function.
 * - AskAboutFilesOutput - The return type for the askAboutFiles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskAboutFilesInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to be analyzed.'),
  xmlDefinition: z.string().describe('The XML definition file describing file content rules.'),
  question: z.string().describe('The user\'s question about the file.'),
});
export type AskAboutFilesInput = z.infer<typeof AskAboutFilesInputSchema>;

const AskAboutFilesOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\'s question.'),
});
export type AskAboutFilesOutput = z.infer<typeof AskAboutFilesOutputSchema>;

export async function askAboutFiles(input: AskAboutFilesInput): Promise<AskAboutFilesOutput> {
  return askAboutFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAboutFilesPrompt',
  input: { schema: AskAboutFilesInputSchema },
  output: { schema: AskAboutFilesOutputSchema },
  prompt: `You are an expert file analyst. You have been provided with the content of a file and an XML definition. A user will ask you a question about this file. Your task is to answer the question based on the provided context.

File Content:
'''
{{fileContent}}
'''

XML Definition:
'''
{{xmlDefinition}}
'''

User's Question:
{{question}}

Provide a clear and concise answer to the question.
`,
});

const askAboutFilesFlow = ai.defineFlow(
  {
    name: 'askAboutFilesFlow',
    inputSchema: AskAboutFilesInputSchema,
    outputSchema: AskAboutFilesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
