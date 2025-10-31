'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AnalysisResult = {
  issues: string[];
  suggestions: string;
};

type AnalysisContextType = {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  fileContent: string | null;
  setFileContent: (content: string | null) => void;
  xmlDefinition: string | null;
  setXmlDefinition: (content: string | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  xmlName: string;
  setXmlName: (name: string) => void;
  clearAnalysis: () => void;
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [xmlDefinition, setXmlDefinition] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [xmlName, setXmlName] = useState('');

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setFileContent(null);
    setXmlDefinition(null);
    setFileName('');
    setXmlName('');
  };

  return (
    <AnalysisContext.Provider value={{ 
      analysisResult, setAnalysisResult,
      fileContent, setFileContent,
      xmlDefinition, setXmlDefinition,
      fileName, setFileName,
      xmlName, setXmlName,
      clearAnalysis
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
