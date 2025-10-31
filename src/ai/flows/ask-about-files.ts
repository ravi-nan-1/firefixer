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
import { createStreamableValue } from 'ai/rsc';

const AskAboutFilesInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to be analyzed.'),
  xmlDefinition: z.string().describe('The XML definition file describing file content rules.'),
  question: z.string().describe('The user\'s question about the file.'),
});
export type AskAboutFilesInput = z.infer<typeof AskAboutFilesInputSchema>;

export type AskAboutFilesOutput = {
  answer: any;
};

export async function askAboutFiles(input: AskAboutFilesInput): Promise<AskAboutFilesOutput> {
  const stream = createStreamableValue('');
  
  (async () => {
    const { stream: responseStream } = await ai.generateStream({
      prompt: `You are an expert file analyst. You have been provided with the content of a file and an XML definition. A user will ask you a question about this file. Your task is to answer the question based on the provided context.

      File Content:
      '''
      ${input.fileContent}
      '''
      
      XML Definition:
      '''
      ${input.xmlDefinition}
      '''
      
      User's Question:
      ${input.question}
      
      Provide a clear and concise answer to the question.`,
    });

    for await (const chunk of responseStream) {
      stream.update(chunk.text);
    }
    stream.done();
  })();

  return { answer: stream.value };
}
