'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tool = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  category: string;
  href: string;
};

type ToolCardProps = {
  tool: Tool;
  onClick: () => void;
};

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <Card 
      className="flex flex-col justify-between h-full group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-xl"
      onClick={onClick}
    >
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="p-3 bg-primary/10 rounded-lg">
          <tool.Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base font-semibold leading-tight">{tool.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Use Tool
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
