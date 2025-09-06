
import {googleAI} from '@genkit-ai/googleai';
import {configureGenkit} from 'genkit';

export default configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY as string,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
