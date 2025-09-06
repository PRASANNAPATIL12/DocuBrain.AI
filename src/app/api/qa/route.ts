// src/app/api/qa/route.ts
import {NextResponse} from 'next/server';
import {generateSemanticEmbeddings} from '@/ai/flows/generate-semantic-embeddings';
import {generateContextualAnswer} from '@/ai/flows/generate-contextual-answers';
import {configureGenkit} from '@/ai/genkit';

// Initialize Genkit
configureGenkit();

interface Chunk {
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

export async function POST(request: Request) {
  try {
    const {query, chunks} = (await request.json()) as {
      query: string;
      chunks: Chunk[];
    };

    if (!query || !chunks || chunks.length === 0) {
      return NextResponse.json(
        {error: 'Query and chunks are required.'},
        {status: 400}
      );
    }

    // 1. Generate embedding for the user's query
    const {embedding: queryEmbedding} = await generateSemanticEmbeddings({ textChunk: query });

    // 2. Find the most relevant chunks using cosine similarity
    const similarities = chunks.map(chunk => ({
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    // 3. Select the top K most relevant chunks
    const topK = 3;
    const relevantChunks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(chunk => chunk.text); // We only need the text for the final answer

    // 4. Generate a contextual answer based on the relevant chunks
    const {answer} = await generateContextualAnswer({
      query,
      relevantChunks,
    });

    // 5. Return the final answer
    return NextResponse.json({answer});

  } catch (error) {
    console.error('Error in QA API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get answer.';
    return NextResponse.json(
      {error: errorMessage},
      {status: 500}
    );
  }
}
