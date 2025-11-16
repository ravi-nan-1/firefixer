'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Image, FileText, Video, Box, Star } from 'lucide-react';
import ToolCard from '@/components/tool-card';
import { tools as toolsData, categories } from '@/lib/tools-data';
import { useLanguage } from '@/context/LanguageContext';

const categoryIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  All: Box,
  'Image Tools': Image,
  'PDF Tools': FileText,
  'Video Tools': Video,
  Popular: Star,
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const { t } = useLanguage();

  const tools = toolsData.map(tool => ({
    ...tool,
    title: t(`tool.${tool.id}.title`),
    description: t(`tool.${tool.id}.description`),
  }));

  useEffect(() => {
    try {
      const savedRecent = localStorage.getItem('recentlyUsedTools');
      if (savedRecent) {
        setRecentlyUsed(JSON.parse(savedRecent));
      }
    } catch (error) {
      console.error("Failed to parse recently used tools from localStorage", error);
      setRecentlyUsed([]);
    }
  }, []);

  const handleToolClick = (id: string) => {
    setRecentlyUsed(prev => {
      const newRecent = [id, ...prev.filter(toolId => toolId !== id)].slice(0, 4);
      try {
        localStorage.setItem('recentlyUsedTools', JSON.stringify(newRecent));
      } catch (error) {
        console.error("Failed to save recently used tools to localStorage", error);
      }
      return newRecent;
    });
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const originalTool = toolsData.find(t => t.id === tool.id)!;
      const matchesCategory = activeCategory === 'All' || originalTool.category === activeCategory;
      const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory, tools]);
  
  const recentTools = useMemo(() => {
    return recentlyUsed.map(id => tools.find(tool => tool.id === id)).filter(Boolean);
  }, [recentlyUsed, tools]);


  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground">
          {t('ultimate-file-tools')}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('free-fast-private')}
        </p>
      </div>

      <div className="mb-10 px-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a tool (e.g., 'remove background', 'PDF to JPG')..."
            className="w-full pl-10 h-12 rounded-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map(category => {
            const Icon = categoryIcons[category] || Box;
            return (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'ghost'}
                className="rounded-full"
                onClick={() => setActiveCategory(category)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {category}
              </Button>
            )
          })}
        </div>
      </div>
      
      {recentTools.length > 0 && (
         <div className="mb-12">
          <h2 className="text-2xl font-bold font-headline mb-6 text-center md:text-left">{t('recently-used')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentTools.map(tool => tool && <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.id)} />)}
          </div>
        </div>
      )}


      <div className="mb-12">
        <h2 className="text-2xl font-bold font-headline mb-6 text-center md:text-left">
          {activeCategory === 'All' ? t('all-tools') : t(activeCategory.toLowerCase().replace(' ', '-') as any)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.id)} />
          ))}
        </div>
        {filteredTools.length === 0 && (
          <p className="text-center col-span-full text-muted-foreground mt-8">
            {t('no-tools-found')}
          </p>
        )}
      </div>

      <div className="mt-20 py-16 bg-card rounded-2xl border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            {t('fast-free-secure')}
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground mb-10">
            {t('privacy-description')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3 rounded-lg">
               <Star className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">{t('no-watermarks')}</h3>
                <p className="text-sm text-muted-foreground">{t('no-watermarks-desc')}</p>
              </div>
            </div>
             <div className="flex items-center gap-3 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <div>
                <h3 className="font-semibold">{t('encrypted-uploads')}</h3>
                <p className="text-sm text-muted-foreground">{t('encrypted-uploads-desc')}</p>
              </div>
            </div>
             <div className="flex items-center gap-3 p-3 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v6"></path><path d="M14 2v6h6"></path><path d="M12 18v-6"></path><path d="m15 15-3 3-3-3"></path></svg>
              <div>
                <h3 className="font-semibold">{t('auto-delete-files')}</h3>
                <p className="text-sm text-muted-foreground">{t('auto-delete-files-desc')}</p>
              </div>
            </div>
             <div className="flex items-center gap-3 p-3 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="00 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <div>
                <h3 className="font-semibold">{t('no-login-required')}</h3>
                <p className="text-sm text-muted-foreground">{t('no-login-required-desc')}</p>
              </div>
            </div>
          </div>
          <div className="mt-12 font-mono text-muted-foreground flex items-center justify-center space-x-2 md:space-x-4">
            <span>{t('upload')}</span>
            <span className="text-primary">{'>'}</span>
            <span>{t('process')}</span>
            <span className="text-primary">{'>'}</span>
            <span>{t('download')}</span>
             <span className="text-primary">{'>'}</span>
            <span className="text-destructive">{t('auto-delete')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
