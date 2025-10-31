'use server';

import { analyzeFileForIssues } from '@/ai/flows/analyze-file-for-issues';
import { suggestFixesForIdentifiedIssues } from '@/ai/flows/suggest-fixes-for-identified-issues';
import { askAboutFiles } from '@/ai/flows/ask-about-files';
import { z } from 'zod';
import { createStreamableValue } from 'ai/rsc';


const analyzeSchema = z.object({
  fileContent: z.string(),
  xmlDefinition: z.string(),
});

export async function analyzeAndSuggest(
  input: z.infer<typeof analyzeSchema>
) {
  const { fileContent, xmlDefinition } = input;

  try {
    const analysisResult = await analyzeFileForIssues({
      fileContent,
      xmlDefinition,
    });

    let suggestionResult;
    if (analysisResult.issues.length > 0) {
      const identifiedIssues = analysisResult.issues.join('\n- ');
      suggestionResult = await suggestFixesForIdentifiedIssues({
        fileContent,
        xmlDefinition,
        identifiedIssues: `- ${identifiedIssues}`,
      });
    } else {
      suggestionResult = { fixSuggestions: 'No issues found. Your file seems to be in good shape!' };
    }

    return {
      issues: analysisResult.issues,
      suggestions: suggestionResult.fixSuggestions,
    };

  } catch (error: any) {
    console.error('Error during analysis:', error);
    // Ensure we always return a serializable error object
    return { error: error.message || 'An unexpected error occurred during analysis.' };
  }
}

const askSchema = z.object({
  question: z.string(),
  fileContent: z.string(),
  xmlDefinition: z.string(),
});

export async function ask(
  input: z.infer<typeof askSchema>
) {
  'use server';
  
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
      // Note: We're not using structured output here for the streaming chat response.
      // The output will be plain text.
    });
    
    for await (const chunk of responseStream) {
      stream.update(chunk.text);
    }
    stream.done();
  })();
  
  return { output: stream.value };
}