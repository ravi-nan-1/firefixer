'use client';

import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Logo from '../icons/logo';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  children: React.ReactNode;
};

export default function ChatMessage({ role, children }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-3 md:gap-4 animate-in fade-in',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      <Avatar className="shadow-sm border">
        <AvatarFallback className={cn(isAssistant ? 'bg-background' : 'bg-primary')}>
          {isAssistant ? <Logo className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary-foreground" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-3 shadow-sm',
          isAssistant
            ? 'bg-card text-card-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {typeof children === 'string' ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{children}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
