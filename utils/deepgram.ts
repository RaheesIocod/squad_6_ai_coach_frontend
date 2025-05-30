import { DeepgramClient } from '@deepgram/sdk';

const DEEPGRAM_API_KEY = '515e95e439189e09ee688a8720d0d61f802f5521';

if (!DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM_API_KEY is required');
}

export const deepgram = new DeepgramClient({ key: DEEPGRAM_API_KEY });