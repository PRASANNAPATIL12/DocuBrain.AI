"use client";

import type { ChangeEvent } from "react";
import { Bot, FileText, Loader2 } from "lucide-react";
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
  handleProcess: () => void;
  isLoading: boolean;
  chunks: string[];
}

export function DocumentProcessor({
  documentText,
  setDocumentText,
  handleProcess,
  isLoading,
  chunks,
}: DocumentProcessorProps) {
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentText(e.target.value);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          <CardTitle className="font-headline text-2xl">
            1. Process Document
          </CardTitle>
        </div>
        <CardDescription>
          Paste your document content below. The system will automatically
          split it into manageable chunks for the AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          placeholder="Paste your document here..."
          value={documentText}
          onChange={handleTextChange}
          className="min-h-[200px] flex-grow text-sm"
          disabled={isLoading}
        />
        <Button
          onClick={handleProcess}
          disabled={isLoading || !documentText.trim()}
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
