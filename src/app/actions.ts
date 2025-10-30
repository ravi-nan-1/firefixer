'use server';

import { analyzeFileForIssues } from '@/ai/flows/analyze-file-for-issues';
import { suggestFixesForIdentifiedIssues } from '@/ai/flows/suggest-fixes-for-identified-issues';
import { z } from 'zod';

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Your file is required.'),
  xml: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'XML definition file is required.'),
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
      message:
        fieldErrors.file?.[0] ||
        fieldErrors.xml?.[0] ||
        'Invalid file inputs.',
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

    if (!analysisResult.issues || analysisResult.issues.length === 0) {
      return {
        status: 'success',
        issues: [],
        suggestions:
          'No issues found in the file. It appears to be compliant with the provided XML definition.',
        fileName: file.name,
        xmlName: xml.name,
      };
    }

    const identifiedIssues = analysisResult.issues.join('\n- ');
    const suggestionResult = await suggestFixesForIdentifiedIssues({
      fileContent,
      xmlDefinition,
      identifiedIssues: `- ${identifiedIssues}`,
    });

    return {
      status: 'success',
      issues: analysisResult.issues,
      suggestions: suggestionResult.fixSuggestions,
      fileName: file.name,
      xmlName: xml.name,
    };
  } catch (error) {
    console.error('Error during analysis:', error);
    return {
      status: 'error',
      message:
        'An unexpected error occurred while processing the files. Please try again.',
    };
  }
}
