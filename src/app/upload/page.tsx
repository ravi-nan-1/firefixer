'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeAndSuggest, type AnalysisState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowUp,
  File as FileIcon,
  FileCode,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';

const initialState: AnalysisState = {
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <ArrowUp className="mr-2 h-4 w-4" />
          Analyze Files
        </>
      )}
    </Button>
  );
}

export default function UploadPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(analyzeAndSuggest, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: state.message,
      });
      // Redirect to clear the form action state
      redirect('/upload');
    }
  }, [state, toast]);

  return (
    <div className="w-full max-w-2xl">
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload your file and its XML definition to start the analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="flex items-center gap-2 font-medium">
                  <FileIcon className="h-4 w-4" />
                  Content File
                </Label>
                <Input id="file" name="file" type="file" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xml" className="flex items-center gap-2 font-medium">
                  <FileCode className="h-4 w-4" />
                  XML Definition
                </Label>
                <Input
                  id="xml"
                  name="xml"
                  type="file"
                  required
                  accept=".xml,text/xml"
                />
              </div>
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
