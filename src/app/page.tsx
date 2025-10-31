'use client';
import { useAnalysis } from '@/context/AnalysisContext';
import UploadPage from '@/app/upload/page';
import ChatInterface from '@/components/chat/chat-interface';

export default function Home() {
  const { analysisResult, fileContent, xmlDefinition, fileName, xmlName } = useAnalysis();

  if (!analysisResult || !fileContent || !xmlDefinition) {
    return <UploadPage />;
  }
  
  return (
    <ChatInterface
      issues={analysisResult.issues}
      suggestions={analysisResult.suggestions}
      fileName={fileName}
      xmlName={xmlName}
      fileContent={fileContent}
      xmlDefinition={xmlDefinition}
    />
  );
}
