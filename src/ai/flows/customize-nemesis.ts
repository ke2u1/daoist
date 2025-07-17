// customize-nemesis.ts
'use server';

/**
 * @fileOverview Generates or updates a Nemesis based on user input.
 *
 * - customizeNemesis - A function that handles the nemesis customization process.
 * - CustomizeNemesisInput - The input type for the function.
 * - CustomizeNemesisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { CustomizeNemesisInputSchema, NemesisSchema } from '@/lib/types';
import type { CustomizeNemesisInput, CustomizeNemesisOutput } from '@/lib/types';


export async function customizeNemesis(input: CustomizeNemesisInput): Promise<CustomizeNemesisOutput> {
  return customizeNemesisFlow(input);
}

const customizeNemesisPrompt = ai.definePrompt({
  name: 'customizeNemesisPrompt',
  input: {schema: CustomizeNemesisInputSchema},
  output: {schema: NemesisSchema},
  prompt: `You are an AI storyteller in the "DAO OF BENEFITS" app. A user wants to create or edit their rival. This is a cultivation-themed app, but the user and their rival are from modern-day Earth, using this system to achieve real-world goals.

The user's context:
- Current Rank: {{{userRank}}}
- Grand Scheme (Ultimate Goal): {{{objective}}}

The user has provided the following details for their rival:
- Custom Prompt: {{{prompt}}}

Based on ALL of this information (user's context and their custom prompt), you must generate or update the rival.

Generate the following:

1.  **name**: A plausible, common, real-world name (e.g., "Alex Chen", "Jessica Rodriguez"). If the user provided a name hint in the prompt, use it. Otherwise, create one that fits the context. Do NOT use fantasy names.
2.  **title**: A modern, impressive-sounding title related to their goals, which should be similar or in opposition to the user's goals. This should sound like a real job title or accomplishment (e.g., 'Lead Data Scientist', 'Founder at Zenith Labs'). If the user provided a title hint, use it. Do NOT use fantasy titles.
3.  **rank**: The nemesis's rank. It must be the same as the user's rank: {{{userRank}}}.
4.  **points**: The nemesis's Primeval Essence (points). This should be a value that is appropriate for their rank.
5.  **backstory**: A short, compelling backstory (1-2 sentences) explaining why this person is the user's rival in the real world. Connect it directly to the user's stated goals AND the user's custom prompt.
6.  **lastAction**: A sentence describing a recent, real-world achievement related to their goals, inspired by the user's prompt. It should sound like they are also actively working towards something (e.g., "was last seen securing a new round of funding").

The 'lastUpdated' field should be the current date and time in ISO 8601 format. The rival must feel like they belong on modern-day Earth.
`,
});

const customizeNemesisFlow = ai.defineFlow(
  {
    name: 'customizeNemesisFlow',
    inputSchema: CustomizeNemesisInputSchema,
    outputSchema: NemesisSchema,
  },
  async input => {
    const {output} = await customizeNemesisPrompt(input);
    if (!output) {
        throw new Error("Failed to generate nemesis");
    }
    output.lastUpdated = new Date().toISOString();
    return output;
  }
);
