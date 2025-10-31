'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ask } from '@/app/actions';
import { ArrowUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './chat-message';
import AnalysisResult from './analysis-result';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: React.ReactNode;
};

function ChatInterfaceContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const issues = JSON.parse(searchParams.get('issues') || '[]');
  const suggestions = searchParams.get('suggestions') || '';
  const fileName = searchParams.get('fileName') || '';
  const xmlName = searchParams.get('xmlName') || '';
  const fileContent = searchParams.get('fileContent') || '';
  const xmlDefinition = searchParams.get('xmlDefinition') || '';

  useEffect(() => {
    const initialAssistantMessage: Message = {
      id: 1,
      role: 'assistant',
      content: <AnalysisResult issues={issues} suggestions={suggestions} />,
    };
    const userMessage: Message = {
      id: 0,
      role: 'user',
      content: `Analyzing file: \`${fileName}\` with definition: \`${xmlName}\``,
    };
    setMessages([userMessage, initialAssistantMessage]);
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
      id: Date.now(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const answer = await ask(fileContent, xmlDefinition, input);
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I couldn't get a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-1 pr-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role}>
            {msg.content}
          </ChatMessage>
        ))}
        {isLoading && (
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


export default function ChatInterface() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatInterfaceContent />
        </Suspense>
    )
}
