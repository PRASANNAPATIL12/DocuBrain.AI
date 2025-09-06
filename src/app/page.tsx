"use client";

import { useState } from "react";
import { DocumentProcessor } from "@/components/docubrain/document-processor";
import { Header } from "@/components/docubrain/header";
import { QAInterface } from "@/components/docubrain/qa-interface";
import { useToast } from "@/hooks/use-toast";

export interface Chunk {
  text: string;
  // The embedding is handled server-side, but the client needs the text.
  // We can simplify the client-side Chunk to just be string if we want,
  // but keeping the object structure can be useful for future features.
  embedding: number[]; 
}

export default function Home() {
  const [documentText, setDocumentText] = useState("");
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { toast } = useToast();

  // This function now calls our dedicated server endpoint for processing.
  const handleProcess = async (textToProcess?: string) => {
    const content = textToProcess || documentText;
    if (!content.trim()) return;

    setIsLoading(true);
    setChunks([]);
    setAnswer("");

    try {
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.error || 'Failed to process document on the server.');
      }

      const { chunks: processedChunks } = await response.json();
      setChunks(processedChunks);

      toast({
        title: "Document Processed",
        description: `Your document is ready. You can now ask questions.`,
      });

    } catch (error: any) {
      console.error("Error processing document:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: error.message || "Failed to process the document. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This function now sends the query and chunks to the server for the full QA process.
  const handleQuery = async () => {
    if (!query.trim() || chunks.length === 0) return;

    setIsAnswering(true);
    setAnswer("");

    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          chunks, // Send the full chunks, including embeddings
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.error || 'API request failed');
      }

      const result = await response.json();
      setAnswer(result.answer);
    } catch (error: any) {
      console.error("Error generating answer:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: `Failed to generate an answer: ${error.message}`,
      });
    } finally {
      setIsAnswering(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
  
    setIsUploading(true);
    setDocumentText('');
    setChunks([]);
    setAnswer('');
    setFileName(file.name);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('File upload failed');
      }
  
      const { text } = await response.json();
      setDocumentText(text);
      toast({
        title: 'File Uploaded',
        description:
          'The document text has been extracted. Now processing on the server...',
      });
      // Immediately process the extracted text
      await handleProcess(text);
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileName(null);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to upload or parse the file. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <DocumentProcessor
            documentText={documentText}
            setDocumentText={setDocumentText}
            handleProcess={handleProcess}
            isLoading={isLoading}
            chunks={chunks.map(c => c.text)} // We only need to display the text
            handleFileUpload={handleFileUpload}
            isUploading={isUploading}
            fileName={fileName}
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
        Powered by DocuBrain.AI
      </footer>
    </div>
  );
}
