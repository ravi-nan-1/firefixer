'use client';
import ChatInterface from '@/components/chat/chat-interface';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getSessionData } from '@/app/actions';

function ChatPageClient() {
  const searchParams = useSearchParams();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [xmlDefinition, setXmlDefinition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const issues = JSON.parse(searchParams.get('issues') || '[]');
  const suggestions = searchParams.get('suggestions') || '';
  const fileName = searchParams.get('fileName') || '';
  const xmlName = searchParams.get('xmlName') || '';
  const sessionId = searchParams.get('sessionId');


  useEffect(() => {
    if (sessionId) {
      getSessionData(sessionId).then(data => {
        if (data) {
          setFileContent(data.fileContent);
          setXmlDefinition(data.xmlDefinition);
        }
        setIsLoading(false);
      });
    } else {
        setIsLoading(false);
    }
  }, [sessionId]);
  
  if (isLoading || !sessionId) {
      return (
          <div className="flex items-center justify-center h-full">
              <p>Loading chat...</p>
          </div>
      )
  }

  if (!fileContent || !xmlDefinition) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className='text-lg font-semibold'>Session Expired or Invalid</p>
            <p className='text-muted-foreground'>Could not load file data. Please start over by uploading your files again.</p>
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
      sessionId={sessionId}
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
