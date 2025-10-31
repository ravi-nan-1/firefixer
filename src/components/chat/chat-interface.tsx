'use client';

import { useEffect, useRef, useState } from 'react';
import { ask } from '@/app/actions';
import { ArrowUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import ChatMessage from './chat-message';
import AnalysisResult from './analysis-result';
import { Card, CardContent } from '../ui/card';
import { readStreamableValue } from 'ai/rsc';
import { useAnalysis } from '@/context/AnalysisContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

type ChatInterfaceProps = {
  issues: string[];
  suggestions: string;
  fileName: string;
  xmlName: string;
  fileContent: string;
  xmlDefinition: string;
};

export default function ChatInterface({
  issues,
  suggestions,
  fileName,
  xmlName,
  fileContent,
  xmlDefinition
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { clearAnalysis } = useAnalysis();

  useEffect(() => {
    if (fileName && xmlName) {
      const initialAssistantMessage: Message = {
        id: '1',
        role: 'assistant',
        content: <AnalysisResult issues={issues} suggestions={suggestions} />,
      };
      const userMessage: Message = {
        id: '0',
        role: 'user',
        content: `Analyzing file: \`${fileName}\` with definition: \`${xmlName}\``,
      };
      setMessages([userMessage, initialAssistantMessage]);
    }
  }, [issues, suggestions, fileName, xmlName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    const question = input;
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: 'assistant', content: '' },
    ]);

    try {
      const { output } = await ask({ question, fileContent, xmlDefinition });
      
      let finalContent = '';
      for await (const delta of readStreamableValue(output)) {
        finalContent += delta;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: finalContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: "Sorry, I couldn't get a response. Please try again.",
      };
      setMessages((prev) => 
        prev.map(msg => msg.id === assistantMessageId ? errorMessage : msg)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl">
       <Button onClick={clearAnalysis} variant="outline" className="mb-4 self-start">
        Start Over
      </Button>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-1 pr-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role}>
            {msg.content}
          </ChatMessage>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <ChatMessage role="assistant">
            <Loader2 className="h-5 w-5 animate-spin" />
          </ChatMessage>
        )}
      </div>
      <div className="mt-auto pt-4">
        <Card className="shadow-xl rounded-xl">
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
