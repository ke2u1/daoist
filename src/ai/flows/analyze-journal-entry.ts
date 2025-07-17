// analyze-journal-entry.ts
'use server';

/**
 * @fileOverview Analyzes a user's journal entry for sentiment and recurring themes.
 *
 * - analyzeJournalEntry - A function that performs the analysis.
 * - AnalyzeJournalEntryInput - The input type for the function.
 * - AnalyzeJournalEntryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeJournalEntryInputSchema, AnalyzeJournalEntryOutputSchema, type AnalyzeJournalEntryInput, type AnalyzeJournalEntryOutput } from '@/lib/types';


export async function analyzeJournalEntry(
  input: AnalyzeJournalEntryInput
): Promise<AnalyzeJournalEntryOutput> {
  return analyzeJournalEntryFlow(input);
}

const analyzeJournalEntryPrompt = ai.definePrompt({
  name: 'analyzeJournalEntryPrompt',
  input: {schema: AnalyzeJournalEntryInputSchema},
  output: {schema: AnalyzeJournalEntryOutputSchema},
  prompt: `You are an insightful AI assistant in the "DAO OF BENEFITS" app, specializing in analyzing a cultivator's journal entries.

Analyze the following journal entry written by the cultivator. Identify the overall sentiment (positive, negative, neutral) and extract up to three key themes or recurring thoughts. These themes could represent their struggles, aspirations, or focus areas.

Journal Entry:
"{{{entry}}}"
`,
});

const analyzeJournalEntryFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntryFlow',
    inputSchema: AnalyzeJournalEntryInputSchema,
    outputSchema: AnalyzeJournalEntryOutputSchema,
  },
  async input => {
    const {output} = await analyzeJournalEntryPrompt(input);
    return output!;
  }
);
