import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-file-for-issues.ts';
import '@/ai/flows/suggest-fixes-for-identified-issues.ts';
import '@/ai/flows/ask-about-files.ts';
