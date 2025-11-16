import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Menu, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Header() {
  const languages = ['English', 'Español', 'Français', 'Deutsch', '中文', '日本語', 'Português', 'Русский', 'العربية', 'हिन्दी'];

  return (
    <header className="border-b shadow-sm sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-headline font-bold text-foreground tracking-tight">
            Ultimate File Tools
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/#image-tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Image Tools</Link>
          <Link href="/#pdf-tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">PDF Tools</Link>
          <Link href="/#video-tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Video Tools</Link>
          <Link href="/#converters" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Converters</Link>
        </nav>

        <div className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map(lang => (
                <DropdownMenuItem key={lang}>{lang}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
