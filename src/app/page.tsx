import ChatInterface from '@/components/chat/chat-interface';
import Header from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start py-6 md:py-8 px-4 overflow-hidden">
        <div className="w-full max-w-4xl h-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
