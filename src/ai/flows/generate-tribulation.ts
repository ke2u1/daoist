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
import {z} from 'genkit';

export const GenerateTribulationInputSchema = z.object({
  rank: z.string().describe("The user's current cultivation rank."),
  recentAchievements: z.string().describe('A comma-separated list of recent achievements.'),
  objective: z.string().describe("The user's ultimate long-term goal."),
});
export type GenerateTribulationInput = z.infer<typeof GenerateTribulationInputSchema>;

export const GenerateTribulationOutputSchema = z.object({
  title: z.string().describe("The name of the tribulation (e.g., 'The Trial of the Shattered Dao Heart')."),
  description: z.string().describe("A thematic description of the challenge, what the user must do to overcome it."),
  reward: z.number().describe("The amount of Primeval Essence rewarded for success."),
  penalty: z.number().describe("The amount of Primeval Essence lost on failure."),
});
export type GenerateTribulationOutput = z.infer<typeof GenerateTribulationOutputSchema>;


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
