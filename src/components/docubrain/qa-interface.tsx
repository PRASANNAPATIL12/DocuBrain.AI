"use client";

import { useState, useEffect } from "react";
import { Bot, Loader2, Copy } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface QAInterfaceProps {
  query: string;
  setQuery: (query: string) => void;
  handleQuery: () => void;
  isAnswering: boolean;
  answer: string;
  isDocumentProcessed: boolean;
  apiEndpoint?: string;
}

export function QAInterface({
  query,
  setQuery,
  handleQuery,
  isAnswering,
  answer,
  isDocumentProcessed,
  apiEndpoint,
}: QAInterfaceProps) {
  const { toast } = useToast();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    setOrigin(window.location.origin);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleQuery();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The API endpoint has been copied to your clipboard.",
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6" />
          <CardTitle className="font-headline text-xl md:text-2xl">
            2. Ask a Question
          </CardTitle>
        </div>
        <CardDescription>
          Query the processed document using natural language. The AI will provide a contextual answer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
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
            className="w-full sm:w-auto"
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
      {apiEndpoint && origin && (
        <CardFooter className="flex flex-col items-start gap-2 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              Your Q&amp;A API Endpoint
            </h3>
            <div className="w-full flex items-center gap-2 rounded-md border p-2 bg-muted/50">
              <pre className="text-xs overflow-x-auto">
                <code>{`POST ${origin}${apiEndpoint}`}</code>
              </pre>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(`curl -X POST ${origin}${apiEndpoint} -H "Content-Type: application/json" -d '{"query": "Your question here..."}'`)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy curl command</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                The API request body should contain your \`query\` and the processed \`chunks\` from step 1. For a real application, you would store the chunks/embeddings in a database.
            </p>
        </CardFooter>
      )}
    </Card>
  );
}
