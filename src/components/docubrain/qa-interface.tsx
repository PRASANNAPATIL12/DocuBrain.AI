"use client";

import { Bot, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface QAInterfaceProps {
  query: string;
  setQuery: (query: string) => void;
  handleQuery: () => void;
  isAnswering: boolean;
  answer: string;
  isDocumentProcessed: boolean;
}

export function QAInterface({
  query,
  setQuery,
  handleQuery,
  isAnswering,
  answer,
  isDocumentProcessed,
}: QAInterfaceProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleQuery();
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6" />
          <CardTitle className="font-headline text-2xl">
            2. Ask a Question
          </CardTitle>
        </div>
        <CardDescription>
          Query the processed document using natural language. The AI will provide a contextual answer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., What is the company's leave policy?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!isDocumentProcessed || isAnswering}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleQuery}
            disabled={!isDocumentProcessed || isAnswering || !query.trim()}
          >
            {isAnswering ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Ask"
            )}
          </Button>
        </div>
        
        {(isAnswering || answer) && (
            <div className="rounded-lg border bg-card p-4 animate-in fade-in-0 duration-500">
                <div className="flex items-start space-x-4">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            <Bot className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-primary">DocuBrain Assistant</p>
                            {isAnswering && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>}
                        </div>
                        {isAnswering && !answer && (
                            <p className="text-sm text-muted-foreground italic">Searching for the answer...</p>
                        )}
                        {answer && (
                            <p className="text-sm whitespace-pre-wrap font-light leading-relaxed">{answer}</p>
                        )}
                    </div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
