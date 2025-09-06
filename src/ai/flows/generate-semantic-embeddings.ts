'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSemanticEmbeddingsInputSchema = z.object({
  textChunk: z.string().describe('The text chunk to embed.'),
});
export type GenerateSemanticEmbeddingsInput = z.infer<typeof GenerateSemanticEmbeddingsInputSchema>;

const GenerateSemanticEmbeddingsOutputSchema = z.object({
  embedding: z.array(z.number()).describe('The semantic embedding for the text chunk.'),
});
export type GenerateSemanticEmbeddingsOutput = z.infer<typeof GenerateSemanticEmbeddingsOutputSchema>;

export async function generateSemanticEmbeddings(input: GenerateSemanticEmbeddingsInput): Promise<GenerateSemanticEmbeddingsOutput> {
  return generateSemanticEmbeddingsFlow(input);
}

const generateSemanticEmbeddingsFlow = ai.defineFlow(
  {
    name: 'generateSemanticEmbeddingsFlow',
    inputSchema: GenerateSemanticEmbeddingsInputSchema,
    outputSchema: GenerateSemanticEmbeddingsOutputSchema,
  },
  async ({ textChunk }) => {
    const embeddingResponse = await ai.embed({
        content: textChunk,
    });

    const embedding = embeddingResponse.output();
    if (embedding === null || embedding === undefined) {
        throw new Error("Failed to generate an embedding for the text chunk.");
    }

    return { embedding };
  }
);
