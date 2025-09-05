"use client";

import { useState } from "react";
import { generateContextualAnswer } from "@/ai/flows/generate-contextual-answers";
import { DocumentProcessor } from "@/components/docubrain/document-processor";
import { Header } from "@/components/docubrain/header";
import { QAInterface } from "@/components/docubrain/qa-interface";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [documentText, setDocumentText] = useState("");
  const [chunks, setChunks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);

  const { toast } = useToast();

  const handleProcess = () => {
    setIsLoading(true);
    setChunks([]);
    setAnswer("");
    // Simulate processing delay
    setTimeout(() => {
      const paragraphs = documentText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 20); // Filter out very short paragraphs
      
      setChunks(paragraphs);
      setIsLoading(false);
      toast({
        title: "Document Processed",
        description: `Your document has been split into ${paragraphs.length} chunks. You can now ask questions.`,
      });
    }, 1000);
  };

  const handleQuery = async () => {
    if (!query.trim() || chunks.length === 0) return;

    setIsAnswering(true);
    setAnswer("");

    try {
      const result = await generateContextualAnswer({
        query: query,
        relevantChunks: chunks,
      });
      setAnswer(result.answer);
    } catch (error) {
      console.error("Error generating answer:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to generate an answer. Please try again.",
      });
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <DocumentProcessor
            documentText={documentText}
            setDocumentText={setDocumentText}
            handleProcess={handleProcess}
            isLoading={isLoading}
            chunks={chunks}
          />
          <QAInterface
            query={query}
            setQuery={setQuery}
            handleQuery={handleQuery}
            isAnswering={isAnswering}
            answer={answer}
            isDocumentProcessed={chunks.length > 0}
          />
        </div>
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground">
        Powered by DocuBrain API
      </footer>
    </div>
  );
}
