import Logo from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="border-b shadow-sm sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Logo className="h-7 w-7 text-primary" />
        <h1 className="text-xl md:text-2xl font-headline font-bold text-foreground tracking-tight">
          FileFixer AI
        </h1>
      </div>
    </header>
  );
}
