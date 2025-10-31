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
    throw new Error(error.message || 'An unexpected error occurred while processing the files. Please try again.');
  }

  const params = new URLSearchParams();
  params.set('issues', JSON.stringify(analysisResult.issues));
  params.set('suggestions', suggestionResult.fixSuggestions);
  params.set('fileName', file.name);
  params.set('xmlName', xml.name);
  params.set('fileContent', fileContent);
  params.set('xmlDefinition', xmlDefinition);

  redirect(`/chat?${params.toString()}`);
}

export async function ask(
  fileContent: string,
  xmlDefinition: string,
  question: string
) {
  'use server';
  
  const { answer } = await askAboutFiles({
    fileContent,
    xmlDefinition,
    question,
  });
  
  return { output: answer };
}
