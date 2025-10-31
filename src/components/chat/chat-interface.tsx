'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
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
import ChatMessage from './chat-message';
import AnalysisResult from './analysis-result';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: React.ReactNode;
};

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

export default function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Welcome to FileFixer AI! Please upload your file and its corresponding XML definition to begin the analysis.',
    },
  ]);
  const [state, formAction] = useActionState(analyzeAndSuggest, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: state.message,
      });
    } else if (state.status === 'success') {
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: `Analyzing file: \`${state.fileName}\` with definition: \`${state.xmlName}\``,
      };

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: (
          <AnalysisResult
            issues={state.issues ?? []}
            suggestions={state.suggestions ?? ''}
          />
        ),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-1 pr-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role}>
            {msg.content}
          </ChatMessage>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <Card className="shadow-xl rounded-xl">
          <CardContent className="p-4">
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
    </div>
  );
}
