
// src/app/api/process-document/route.ts
import { NextResponse } from 'next/server';
import { generateSemanticEmbeddings } from '@/ai/flows/generate-semantic-embeddings';
import { configureGenkit } from '@/ai/genkit';

// Initialize Genkit
configureGenkit();

export interface Chunk {
  text: string;
  embedding: number[];
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

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

    // Process chunks sequentially to avoid overwhelming any rate limits
    const processedChunks: Chunk[] = [];
    for (const textChunk of filteredChunks) {
      const { embedding } = await generateSemanticEmbeddings({ textChunk });
      processedChunks.push({ text: textChunk, embedding });
    }

    return NextResponse.json({ chunks: processedChunks });

  } catch (error) {
    console.error('Error in process-document API:', error);
    // Provide a more specific error message if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to process document.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
