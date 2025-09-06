"use client";

import { useState } from "react";
import { DocumentProcessor } from "@/components/docubrain/document-processor";
import { Header } from "@/components/docubrain/header";
import { QAInterface } from "@/components/docubrain/qa-interface";
import { useToast } from "@/hooks/use-toast";
import { generateSemanticEmbeddings } from "@/ai/flows/generate-semantic-embeddings";

export interface Chunk {
  text: string;
  embedding: number[];
}

// Cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (magA === 0 || magB === 0) {
    return 0;
  }
  return dotProduct / (magA * magB);
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

  const handleProcess = async (textToProcess?: string) => {
    const content = textToProcess || documentText;
    if (!content.trim()) return;
    setIsLoading(true);
    setChunks([]);
    setAnswer("");
    try {
      // Robust chunking strategy
      const chunkSize = 1500; // characters
      const chunkOverlap = 200; // characters
      const textChunks: string[] = [];

      for (let i = 0; i < content.length; i += chunkSize - chunkOverlap) {
        const chunk = content.substring(i, i + chunkSize);
        textChunks.push(chunk);
      }
      
      const filteredChunks = textChunks
        .map(c => c.trim())
        .filter(c => c.length > 10); // Filter out very short/empty chunks

      // Process chunks sequentially to avoid rate limiting
      const processedChunks: Chunk[] = [];
      for (const textChunk of filteredChunks) {
        const { embedding } = await generateSemanticEmbeddings({ textChunk });
        processedChunks.push({ text: textChunk, embedding });
      }

      setChunks(processedChunks);

      toast({
        title: "Document Processed",
        description: `Your document has been split into ${filteredChunks.length} chunks and embeddings have been generated. You can now ask questions.`,
      });
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to process the document. This can happen with very large files. Please try again or use a smaller document.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim() || chunks.length === 0) return;

    setIsAnswering(true);
    setAnswer("");

    try {
      const { embedding: queryEmbedding } = await generateSemanticEmbeddings({ textChunk: query });

      const similarities = chunks.map(chunk => ({
        ...chunk,
        similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
      }));
      
      const topK = 3;
      const relevantChunks = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)
        .map(chunk => chunk.text);

      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          relevantChunks,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.details || 'API request failed');
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
          'The document text has been extracted. Processing...',
      });
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
            chunks={chunks.map(c => c.text)}
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
