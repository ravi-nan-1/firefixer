'use server';

import { analyzeFileForIssues } from '@/ai/flows/analyze-file-for-issues';
import { suggestFixesForIdentifiedIssues } from '@/ai/flows/suggest-fixes-for-identified-issues';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { askAboutFiles } from '@/ai/flows/ask-about-files';

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, 'Your file is required.'),
  xml: z.instanceof(File).refine((file) => file.size > 0, 'XML definition file is required.'),
});

// This is a temporary in-memory store.
// In a real-world application, you might use a database or a server-side cache.
const temporaryDataStore: { [key: string]: any } = {};


export async function analyzeAndSuggest(
  formData: FormData
): Promise<void> {
  const validatedFields = formSchema.safeParse({
    file: formData.get('file'),
    xml: formData.get('xml'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    throw new Error(fieldErrors.file?.[0] || fieldErrors.xml?.[0] || 'Invalid file inputs.');
  }

  const { file, xml } = validatedFields.data;
  let analysisResult;
  let suggestionResult;
  let fileContent;
  let xmlDefinition;

  try {
    fileContent = await file.text();
    xmlDefinition = await xml.text();

    analysisResult = await analyzeFileForIssues({
      fileContent,
      xmlDefinition,
    });

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

  } catch (error: any) {
    console.error('Error during analysis:', error);
    if (error.message.includes('NEXT_REDIRECT')) {
        throw error;
    }
    throw new Error(error.message || 'An unexpected error occurred while processing the files. Please try again.');
  }

  const sessionId = Date.now().toString();
  temporaryDataStore[sessionId] = {
    fileContent,
    xmlDefinition,
  };

  const params = new URLSearchParams();
  params.set('issues', JSON.stringify(analysisResult.issues));
  params.set('suggestions', suggestionResult.fixSuggestions);
  params.set('fileName', file.name);
  params.set('xmlName', xml.name);
  params.set('sessionId', sessionId);

  redirect(`/chat?${params.toString()}`);
}

export async function ask(
  sessionId: string,
  question: string
) {
  'use server';

  const data = temporaryDataStore[sessionId];
  if (!data) {
    // In a real app, you'd want more robust error handling
    throw new Error('Session not found. Please start over.');
  }
  
  const { answer } = await askAboutFiles({
    fileContent: data.fileContent,
    xmlDefinition: data.xmlDefinition,
    question,
  });
  
  return { output: answer };
}

export async function getSessionData(sessionId: string) {
    'use server';
    return temporaryDataStore[sessionId] || null;
}
