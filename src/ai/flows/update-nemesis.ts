
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
import type { UpdateNemesisInput, UpdateNemesisOutput } from '@/lib/types';

export async function updateNemesis(input: UpdateNemesisInput): Promise<UpdateNemesisOutput> {
  return updateNemesisFlow(input.nemesis);
}

const updateNemesisPrompt = ai.definePrompt({
  name: 'updateNemesisPrompt',
  input: {schema: NemesisSchema },
  output: {schema: NemesisSchema.omit({ lastUpdated: true })},
  prompt: `You are an AI storyteller in the "DAO OF BENEFITS" app. It is time to update the user's Nemesis. The Nemesis is a person from modern-day Earth.

Here is the current state of the Nemesis:
- ID: {{{id}}}
- Name: {{{name}}}
- Title: {{{title}}}
- Rank: {{{rank}}}
- Points: {{{points}}}
- Backstory: {{{backstory}}}

A minute has passed. You must describe their progress. You should:
1.  **Keep the id the same**. The id MUST be returned as {{{id}}}.
2.  **Increase their points**: Add a realistic amount of Primeval Essence for a minute of cultivation (e.g., 1-5 points).
3.  **Update their rank**: If their new point total qualifies them for a higher rank, update their rank accordingly.
4.  **Update their lastAction**: Write a new sentence describing a recent, impressive, real-world feat or activity. It should sound plausible and create a sense of urgency for the user (e.g., "finalized a minor task," "was spotted reading a technical journal," "pushed a new code commit").
5.  Keep the name, title, and backstory the same.
6.  Return the updated values for points, rank, and lastAction, along with the original id.

Do not dramatically change the nemesis, just show their steady progress.
`,
});

const updateNemesisFlow = ai.defineFlow(
  {
    name: 'updateNemesisFlow',
    inputSchema: NemesisSchema,
    outputSchema: NemesisSchema,
  },
  async (nemesis) => {
    const {output} = await updateNemesisPrompt(nemesis);
    if (!output) {
        throw new Error("Failed to update nemesis");
    }
    // Set the current date for lastUpdated and preserve the ID
    return {
        ...output,
        id: nemesis.id, // Ensure the original ID is preserved
        lastUpdated: new Date().toISOString(),
    };
  }
);
