// generate-tribulation.ts
'use server';

/**
 * @fileOverview Generates a weekly "tribulation" challenge for the user.
 *
 * - generateWeeklyTribulation - A function that generates the tribulation.
 * - GenerateTribulationInput - The input type for the function.
 * - GenerateTribulationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { GenerateTribulationInputSchema, GenerateTribulationOutputSchema, type GenerateTribulationInput, type GenerateTribulationOutput } from '@/lib/types';


export async function generateWeeklyTribulation(
  input: GenerateTribulationInput
): Promise<GenerateTribulationOutput> {
  return generateTribulationFlow(input);
}

const generateTribulationPrompt = ai.definePrompt({
  name: 'generateTribulationPrompt',
  input: {schema: GenerateTribulationInputSchema},
  output: {schema: GenerateTribulationOutputSchema},
  prompt: `You are the Heavenly Will, designing a weekly challenge (a "Tribulation") for a cultivator in the "DAO OF BENEFITS" app.

The cultivator's details are:
- Rank: {{{rank}}}
- Ultimate Goal: {{{objective}}}
- Recent Achievements: {{{recentAchievements}}}

Design a creative and challenging Tribulation for them. It should be a significant, one-off task for the week, not a simple daily chore. It should be thematically appropriate for their rank and goals.

The output must include:
1.  'title': A dramatic and thematic name for the Tribulation.
2.  'description': A compelling narrative explaining the challenge. What must they do this week to overcome it?
3.  'reward': A substantial Primeval Essence reward for success, scaled to their rank.
4.  'penalty': A painful but not crippling Primeval Essence penalty for failure. The penalty should be roughly half of the reward.
`,
});

const generateTribulationFlow = ai.defineFlow(
  {
    name: 'generateTribulationFlow',
    inputSchema: GenerateTribulationInputSchema,
    outputSchema: GenerateTribulationOutputSchema,
  },
  async input => {
    const {output} = await generateTribulationPrompt(input);
    return output!;
  }
);
