import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'FileFixer AI',
  description: 'Upload files to check for issues and get fix suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans flex flex-col')}>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-start py-6 md:py-8 px-4 overflow-hidden">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
