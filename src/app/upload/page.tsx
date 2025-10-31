'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeAndSuggest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, File as FileIcon, FileCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

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
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleAction = async (formData: FormData) => {
    const file = formData.get('file') as File;
    const xml = formData.get('xml') as File;

    if (!file || file.size === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Your file is required.',
      });
      return;
    }

    if (!xml || xml.size === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'XML definition file is required.',
      });
      return;
    }
    
    try {
        // Since we can't pass large data via URL, we'll push it to history.state
        // This is a bit of a hack, but it works for client-side navigation.
        // A more robust solution might involve a state management library.
        const fileContent = await file.text();
        const xmlDefinition = await xml.text();
        history.replaceState({ ...history.state, fileContent, xmlDefinition }, '');

        await analyzeAndSuggest(formData);

    } catch(error: any) {
        if (error.message.includes('NEXT_REDIRECT')) {
          // This is expected, do nothing.
        } else {
            toast({
                variant: 'destructive',
                title: 'Analysis Error',
                description: error.message,
            });
        }
    }
  };


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
          <form ref={formRef} action={handleAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className="flex items-center gap-2 font-medium"
                >
                  <FileIcon className="h-4 w-4" />
                  Content File
                </Label>
                <Input id="file" name="file" type="file" />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="xml"
                  className="flex items-center gap-2 font-medium"
                >
                  <FileCode className="h-4 w-4" />
                  XML Definition
                </Label>
                <Input id="xml" name="xml" type="file" accept=".xml,text/xml" />
              </div>
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
