'use client';

import { useState } from 'react';
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
import { useAnalysis } from '@/context/AnalysisContext';

export default function UploadPage() {
  const { toast } = useToast();
  const { setAnalysisResult, setFileContent, setXmlDefinition, setFileName, setXmlName } = useAnalysis();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [xml, setXml] = useState<File | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || file.size === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Content file is required.',
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

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const fileContent = await file.text();
      const xmlDefinition = await xml.text();
      
      setFileContent(fileContent);
      setXmlDefinition(xmlDefinition);
      setFileName(file.name);
      setXmlName(xml.name);

      const result = await analyzeAndSuggest({ fileContent, xmlDefinition });

      if (result.error) {
        throw new Error(result.error);
      }

      setAnalysisResult({
        issues: result.issues || [],
        suggestions: result.suggestions || 'No suggestions available.',
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: error.message || 'An unknown error occurred.',
      });
      // Clear state on error so user can retry
      setAnalysisResult(null);
      setFileContent(null);
      setXmlDefinition(null);
    } finally {
      setIsAnalyzing(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className="flex items-center gap-2 font-medium"
                >
                  <FileIcon className="h-4 w-4" />
                  Content File
                </Label>
                <Input id="file" name="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="xml"
                  className="flex items-center gap-2 font-medium"
                >
                  <FileCode className="h-4 w-4" />
                  XML Definition
                </Label>
                <Input id="xml" name="xml" type="file" accept=".xml,text/xml" onChange={(e) => setXml(e.target.files?.[0] || null)} />
              </div>
            </div>
            <Button type="submit" disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
