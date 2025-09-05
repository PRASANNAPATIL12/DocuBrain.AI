// src/app/api/qa/route.ts
import {NextResponse} from 'next/server';
import {generateContextualAnswer} from '@/ai/flows/generate-contextual-answers';

export async function POST(request: Request) {
  try {
    const {query, relevantChunks} = (await request.json()) as {
      query: string;
      relevantChunks: string[];
    };

    if (!query || !relevantChunks || relevantChunks.length === 0) {
      return NextResponse.json(
        {error: 'Query and relevant chunks are required.'},
        {status: 400}
      );
    }

    // Generate contextual answer
    const {answer} = await generateContextualAnswer({
      query,
      relevantChunks,
    });

    return NextResponse.json({answer});
  } catch (error) {
    console.error('Error in QA API:', error);
    return NextResponse.json(
      {error: 'Failed to get answer.'},
      {status: 500}
    );
  }
}
