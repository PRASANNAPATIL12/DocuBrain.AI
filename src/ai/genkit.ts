
import {configure} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';
import {dotprompt} from '@genkit-ai/dotprompt';

export function configureGenkit() {
  configure({
    plugins: [
      dotprompt(),
      googleAI({         
        apiKey: process.env.GOOGLE_AI_API_KEY as string,
      }),
    ],
    logLevel: 'debug',
    enableTracing: true,
  });
}
