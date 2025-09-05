'use server';

/**
 * @fileOverview This flow generates semantic embeddings for text chunks.
 *
 * - generateSemanticEmbeddings - A function that handles the generation of semantic embeddings.
 * - GenerateSemanticEmbeddingsInput - The input type for the generateSemanticEmbeddings function.
 * - GenerateSemanticEmbeddingsOutput - The return type for the generateSemanticEmbeddings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSemanticEmbeddingsInputSchema = z.object({
  textChunk: z.string().describe('The text chunk to generate an embedding for.'),
});
export type GenerateSemanticEmbeddingsInput = z.infer<
  typeof GenerateSemanticEmbeddingsInputSchema
>;

const GenerateSemanticEmbeddingsOutputSchema = z.object({
  embedding: z.array(z.number()).describe('The semantic embedding for the text chunk.'),
});
export type GenerateSemanticEmbeddingsOutput = z.infer<
  typeof GenerateSemanticEmbeddingsOutputSchema
>;

export async function generateSemanticEmbeddings(
  input: GenerateSemanticEmbeddingsInput
): Promise<GenerateSemanticEmbeddingsOutput> {
  return generateSemanticEmbeddingsFlow(input);
}

const generateSemanticEmbeddingsFlow = ai.defineFlow(
  {
    name: 'generateSemanticEmbeddingsFlow',
    inputSchema: GenerateSemanticEmbeddingsInputSchema,
    outputSchema: GenerateSemanticEmbeddingsOutputSchema,
  },
  async input => {
    const embedding = await ai.embed({
      content: input.textChunk,
      embedder: 'googleai/text-embedding-004',
    });
    return {embedding: embedding};
  }
);
