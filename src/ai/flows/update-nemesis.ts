// update-nemesis.ts
'use server';

/**
 * @fileOverview Updates the user's Nemesis weekly.
 *
 * - updateNemesis - A function that handles the nemesis update process.
 * - UpdateNemesisInput - The input type for the updateNemesis function.
 * - UpdateNemesisOutput - The return type for the updateNemesis function.
 */

import {ai} from '@/ai/genkit';
import { UpdateNemesisInputSchema, NemesisSchema } from '@/lib/types';
import { z } from 'genkit';
import type { UpdateNemesisInput, UpdateNemesisOutput } from '@/lib/types';

export async function updateNemesis(input: UpdateNemesisInput): Promise<UpdateNemesisOutput> {
  return updateNemesisFlow(input);
}

// Define a smaller schema for just the fields the AI should update.
const NemesisUpdateOutputSchema = z.object({
    points: z.number().describe("The nemesis's new, increased point total."),
    rank: z.string().describe("The nemesis's rank, updated if necessary based on the new point total."),
    lastAction: z.string().describe("A new sentence describing a recent, impressive, real-world feat or activity."),
});


const updateNemesisPrompt = ai.definePrompt({
  name: 'updateNemesisPrompt',
  input: {schema: NemesisSchema },
  output: {schema: NemesisUpdateOutputSchema},
  prompt: `You are an AI storyteller in the "DAO OF BENEFITS" app. It is time for a minor update to the user's Nemesis, who is a person on modern-day Earth.

Here is the current state of the Nemesis:
- Name: {{{name}}}
- Title: {{{title}}}
- Rank: {{{rank}}}
- Points: {{{points}}}
- Backstory: {{{backstory}}}

A minute has passed. You must describe their progress. You should:
1.  **Increase their points**: Add a small, realistic amount of Primeval Essence for a minute of activity (e.g., 1-5 points).
2.  **Update their rank**: If their new point total qualifies them for a higher rank, update their rank accordingly.
3.  **Update their lastAction**: Write a new, single sentence describing a minor but recent real-world activity (e.g., "finalized a minor task," "was spotted reading a technical journal," "pushed a new code commit").

Return ONLY the updated values for points, rank, and lastAction. Keep the changes small and incremental.
`,
});

const updateNemesisFlow = ai.defineFlow(
  {
    name: 'updateNemesisFlow',
    inputSchema: UpdateNemesisInputSchema,
    outputSchema: NemesisSchema,
  },
  async ({ nemesis }) => {
    const {output} = await updateNemesisPrompt(nemesis);
    if (!output) {
        throw new Error("Failed to update nemesis");
    }
    
    // Merge the AI's output with the original nemesis data
    const updatedNemesis = {
        ...nemesis, // Start with the original object
        ...output,  // Overwrite with the fields returned by the AI
        lastUpdated: new Date().toISOString(), // Set a new timestamp
    };

    return updatedNemesis;
  }
);
