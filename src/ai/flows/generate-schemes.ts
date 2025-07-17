// generate-schemes.ts
'use server';

/**
 * @fileOverview Generates a list of tasks (schemes) for a user based on their goal.
 *
 * - generateSchemesForGoal - A function that generates schemes.
 */

import {ai} from '@/ai/genkit';
import { GenerateSchemesInputSchema, GenerateSchemesOutputSchema, type GenerateSchemesInput, type GenerateSchemesOutput } from '@/lib/types';


export async function generateSchemesForGoal(
  input: GenerateSchemesInput
): Promise<GenerateSchemesOutput> {
  return generateSchemesFlow(input);
}

const generateSchemesPrompt = ai.definePrompt({
  name: 'generateSchemesPrompt',
  input: {schema: GenerateSchemesInputSchema},
  output: {schema: GenerateSchemesOutputSchema},
  prompt: `You are an AI assistant in a cultivation-themed productivity app called "DAO OF BENEFITS". Your purpose is to help a user break down their goals into actionable tasks, which are called "schemes".

The user wants to achieve the following goal: {{{goal}}}

To provide context, here are their broader objectives:
- Ultimate Goal (Grand Scheme): {{{objective}}}
- Short-Term Goal: {{{shortTermGoal}}}

Based on this, generate a list of 3 to 5 creative, relevant, and actionable schemes. The schemes should be presented in a way that fits the cultivation theme of the app (e.g., instead of "Exercise for 30 minutes", it could be "Temper the Mortal Body").

For each scheme, provide:
1.  'text': A clear description of the scheme.
2.  'benefits': A compelling explanation of how this scheme contributes to their goals.
3.  'difficulty': Categorize the difficulty as 'easy', 'medium', 'hard', 'scene', or 'venerable-scene'.
4.  'actualPoints': Assign appropriate Primeval Essence (points) based on the difficulty (easy: 1-4, medium: 5-9, hard: 10-25, scene: 50-99, venerable-scene: 100+).
`,
});

const generateSchemesFlow = ai.defineFlow(
  {
    name: 'generateSchemesFlow',
    inputSchema: GenerateSchemesInputSchema,
    outputSchema: GenerateSchemesOutputSchema,
  },
  async input => {
    const {output} = await generateSchemesPrompt(input);
    return output!;
  }
);
