'use client';
import ChatInterface from '@/components/chat/chat-interface';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ChatPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [xmlDefinition, setXmlDefinition] = useState<string | null>(null);

  useEffect(() => {
    // This is a workaround to get the file content from the previous page's state
    // A better solution would be to use a client-side cache or a state management library
    const navigationState = history.state;
    if (navigationState && navigationState.fileContent && navigationState.xmlDefinition) {
        setFileContent(navigationState.fileContent);
        setXmlDefinition(navigationState.xmlDefinition);
    }

    // Clear the state after reading it
    const newPath = window.location.pathname + '?' + searchParams.toString();
    history.replaceState({}, '', newPath);

  }, [searchParams, router]);
  
  const issues = JSON.parse(searchParams.get('issues') || '[]');
  const suggestions = searchParams.get('suggestions') || '';
  const fileName = searchParams.get('fileName') || '';
  const xmlName = searchParams.get('xmlName') || '';

  if (fileContent === null || xmlDefinition === null) {
      return (
          <div className="flex items-center justify-center h-full">
              <p>Loading chat...</p>
          </div>
      )
  }

  return (
    <ChatInterface
      issues={issues}
      suggestions={suggestions}
      fileName={fileName}
      xmlName={xmlName}
      fileContent={fileContent}
      xmlDefinition={xmlDefinition}
    />
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageClient />
    </Suspense>
  )
}
