// generate-nemesis.ts
'use server';

/**
 * @fileOverview Generates a new Nemesis for the user.
 *
 * - generateNemesis - A function that handles the nemesis generation process.
 * - GenerateNemesisInput - The input type for the generateNemesis function.
 * - GenerateNemesisOutput - The return type for the generateNemesis function.
 */

import {ai} from '@/ai/genkit';
import { GenerateNemesisInputSchema, NemesisSchema } from '@/lib/types';
import type { GenerateNemesisInput, GenerateNemesisOutput } from '@/lib/types';

export async function generateNemesis(input: GenerateNemesisInput): Promise<GenerateNemesisOutput> {
  return generateNemesisFlow(input);
}

const generateNemesisPrompt = ai.definePrompt({
  name: 'generateNemesisPrompt',
  input: {schema: GenerateNemesisInputSchema},
  output: {schema: NemesisSchema},
  prompt: `You are an AI storyteller in the "DAO OF BENEFITS" app. A user has progressed far enough to attract the attention of a rival. This is a cultivation-themed app, but the user and their rival are from modern-day Earth, using this system to achieve real-world goals.

The user's context:
- Current Rank: {{{userRank}}}
- Grand Scheme (Ultimate Goal): {{{objective}}}
- Short-Term Goal: {{{shortTermGoal}}}

You must create a compelling Nemesis for them. The Nemesis is also a person from Earth, using the "DAO OF BENEFITS" system. Their existence should push the user to greater heights.

Generate the following:

1.  **name**: A plausible, common, real-world name (e.g., "Alex Chen", "Jessica Rodriguez", "David Smith"). Do NOT use fantasy or overly dramatic names like "Shadow Sovereign" or "Damien Blackwood".
2.  **title**: A modern, impressive-sounding title related to their goals, which should be similar or in opposition to the user's goals. This should sound like a real job title or accomplishment (e.g., 'Lead Data Scientist', 'Founder at Zenith Labs', 'Lead Researcher on Project Chimera', 'Top Sales Executive'). Do NOT use fantasy titles like 'The Quant King'.
3.  **rank**: The nemesis's rank. It must be the same as the user's rank: {{{userRank}}}.
4.  **points**: The nemesis's Primeval Essence (points). This should be a value that is appropriate for their rank, perhaps slightly above the minimum for that rank.
5.  **backstory**: A short, compelling backstory (1-2 sentences) explaining why this person is the user's rival in the real world. Connect it directly to the user's stated goals. For example, if the user's goal is 'launch a startup', the rival might be 'building a competing product in the same space'. If the user's goal is 'get a promotion', the rival might be 'the other top candidate for the same position'.
6.  **lastAction**: A sentence describing a recent, real-world achievement related to their goals. It should sound like they are also actively working towards something (e.g., "was last seen securing a new round of funding," or "just published a paper in a prestigious journal.").

The 'lastUpdated' field should be the current date and time in ISO 8601 format.
`,
});

const generateNemesisFlow = ai.defineFlow(
  {
    name: 'generateNemesisFlow',
    inputSchema: GenerateNemesisInputSchema,
    outputSchema: NemesisSchema,
  },
  async input => {
    const {output} = await generateNemesisPrompt(input);
    if (!output) {
        throw new Error("Failed to generate nemesis");
    }
    // Set the current date for lastUpdated
    output.lastUpdated = new Date().toISOString();
    return output;
  }
);
