"use client";

import type { ChangeEvent } from "react";
import { useRef } from "react";
import { FileText, Loader2, UploadCloud, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface DocumentProcessorProps {
  documentText: string;
  setDocumentText: (text: string) => void;
  handleProcess: (text?: string) => void;
  isLoading: boolean;
  chunks: string[];
  handleFileUpload: (file: File) => void;
  isUploading: boolean;
  fileName: string | null;
}

export function DocumentProcessor({
  documentText,
  setDocumentText,
  handleProcess,
  isLoading,
  chunks,
  handleFileUpload,
  isUploading,
  fileName,
}: DocumentProcessorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentText(e.target.value);
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const disabled = isLoading || isUploading;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          <CardTitle className="font-headline text-xl md:text-2xl">
            1. Process Document
          </CardTitle>
        </div>
        <CardDescription>
          Upload a PDF, TXT or paste document content below. The system will split it and generate embeddings.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt" className="hidden" />
        <Button onClick={handleUploadClick} variant="outline" disabled={disabled} className="w-full sm:w-auto">
          {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          Upload File
        </Button>
        {fileName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
            <FileIcon className="h-4 w-4" />
            <span className="truncate">{fileName}</span>
          </div>
        )}
        <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or
                </span>
            </div>
        </div>
        <Textarea
          placeholder="Paste your document here..."
          value={documentText}
          onChange={handleTextChange}
          className="min-h-[150px] flex-grow text-sm"
          disabled={disabled}
        />
        <Button
          onClick={() => handleProcess()}
          disabled={disabled || !documentText.trim()}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Process Document"
          )}
        </Button>
      </CardContent>
      {chunks.length > 0 && !isLoading && (
        <CardFooter className="flex flex-col items-start gap-2 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              {chunks.length} Chunks Created
            </h3>
            <ScrollArea className="h-48 w-full rounded-md border p-2">
              <div className="flex flex-col gap-2">
              {chunks.map((chunk, index) => (
                <div key={index} className="text-xs p-2 bg-muted/50 rounded-md">
                  <p className="line-clamp-2">{chunk}</p>
                </div>
              ))}
              </div>
            </ScrollArea>
        </CardFooter>
      )}
    </Card>
  );
}
