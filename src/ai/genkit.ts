
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY as string,
    }),
  ],
  model: 'googleai/gemini-pro',
  embedder: 'googleai/text-embedding-004',
});
