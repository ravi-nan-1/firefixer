'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';

type AnalysisResultProps = {
  issues: string[];
  suggestions: string;
};

export default function AnalysisResult({
  issues,
  suggestions,
}: AnalysisResultProps) {
  const hasIssues = issues.length > 0;

  if (!hasIssues) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <CheckCircle2 className="h-12 w-12 text-accent mb-4" />
        <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
        <p className="text-sm text-muted-foreground">{suggestions}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <h3 className="font-semibold text-lg">Analysis Complete</h3>
      <Accordion
        type="multiple"
        defaultValue={['issues', 'suggestions']}
        className="w-full"
      >
        <AccordionItem value="issues">
          <AccordionTrigger className="text-base hover:no-underline">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>{issues.length} Issue(s) Found</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc space-y-2 pl-6 pt-2 text-sm">
              {issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="suggestions">
          <AccordionTrigger className="text-base hover:no-underline">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Suggested Fixes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-sm space-y-2 pt-2"
              dangerouslySetInnerHTML={{
                __html: suggestions.replace(/\n/g, '<br />'),
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
