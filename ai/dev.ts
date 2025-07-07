import { config } from 'dotenv';
config();

import '@/ai/flows/generate-treatment-options.ts';
import '@/ai/flows/analyze-symptoms.ts';