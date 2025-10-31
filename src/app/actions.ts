'use server';

import { analyzeFileForIssues } from '@/ai/flows/analyze-file-for-issues';
import { suggestFixesForIdentifiedIssues } from '@/ai/flows/suggest-fixes-for-identified-issues';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { askAboutFiles } from '@/ai/flows/ask-about-files';
import { createStreamableValue } from 'ai/rsc';

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, 'Your file is required.'),
  xml: z.instanceof(File).refine((file) => file.size > 0, 'XML definition file is required.'),
});

export type AnalysisState = {
  status: 'success' | 'error' | 'idle';
  issues?: string[];
  suggestions?: string;
  fileName?: string;
  xmlName?: string;
  message?: string;
};

export async function analyzeAndSuggest(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const validatedFields = formSchema.safeParse({
    file: formData.get('file'),
    xml: formData.get('xml'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      status: 'error',
      message: fieldErrors.file?.[0] || fieldErrors.xml?.[0] || 'Invalid file inputs.',
    };
  }

  const { file, xml } = validatedFields.data;

  try {
    const fileContent = await file.text();
    const xmlDefinition = await xml.text();

    const analysisResult = await analyzeFileForIssues({
      fileContent,
      xmlDefinition,
    });

    const identifiedIssues = analysisResult.issues.join('\n- ');
    const suggestionResult = await suggestFixesForIdentifiedIssues({
      fileContent,
      xmlDefinition,
      identifiedIssues: `- ${identifiedIssues}`,
    });
    
    const params = new URLSearchParams();
    params.set('issues', JSON.stringify(analysisResult.issues));
    params.set('suggestions', suggestionResult.fixSuggestions);
    params.set('fileName', file.name);
    params.set('xmlName', xml.name);
    params.set('fileContent', fileContent);
    params.set('xmlDefinition', xmlDefinition);

    redirect(`/chat?${params.toString()}`);

  } catch (error) {
    console.error('Error during analysis:', error);
    return {
      status: 'error',
      message: 'An unexpected error occurred while processing the files. Please try again.',
    };
  }
}

export async function ask(
  fileContent: string,
  xmlDefinition: string,
  question: string
) {
  'use server';
  const stream = createStreamableValue();

  (async () => {
    try {
      const result = await askAboutFiles({
        fileContent,
        xmlDefinition,
        question,
      });
      stream.done(result.answer);
    } catch (error) {
      console.error('Error asking about files:', error);
      stream.done('Sorry, I encountered an error trying to answer your question.');
    }
  })();
  
  return { output: stream.value };
}
