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
  prompt: `You are an AI storyteller in the "DAO OF BENEFITS" app. A user has progressed far enough to attract the attention of a rival.

The user's current rank is: {{{userRank}}}

You must create a compelling Nemesis for them. The Nemesis should be a peer, a rival whose existence will push the user to greater heights. Generate the following:

1.  **name**: A creative and thematic name for the nemesis (e.g., "Shadow Sovereign Xiao Chen", "Crimson Blade Lin Feng").
2.  **title**: A cool title for the nemesis (e.g., 'The Unseen Blade', 'Heir of the Iron Will').
3.  **rank**: The nemesis's rank. It must be the same as the user's rank: {{{userRank}}}.
4.  **points**: The nemesis's Primeval Essence (points). This should be a value that is appropriate for their rank, perhaps slightly above the minimum for that rank.
5.  **backstory**: A short, compelling backstory (1-2 sentences) explaining why this person is the user's rival. Did the user slight them in the past? Do they compete for the same resources? Are their Daos fundamentally opposed?
6.  **lastAction**: A sentence describing what the nemesis was last seen doing. Make it sound like they are also actively cultivating (e.g., "was last seen entering the 'Asura Pagoda' to temper their will.").

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
