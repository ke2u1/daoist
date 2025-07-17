// refine-task-benefits.ts
'use server';

/**
 * @fileOverview Refines task benefits based on user's stated goals using AI.
 *
 * - refineTaskBenefits - A function that refines task benefits.
 * - RefineTaskBenefitsInput - The input type for the refineTaskBenefits function.
 * - RefineTaskBenefitsOutput - The return type for the refineTaskBenefits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineTaskBenefitsInputSchema = z.object({
  objective: z
    .string()
    .describe('The user\'s ultimate long-term goal or grand scheme.'),
  shortTermGoal: z
    .string()
    .describe('The user\'s short-term goal or next major step.'),
  motivation: z
    .string()
    .describe('The user\'s source of motivation and will to persevere.'),
  distractions: z
    .string()
    .describe('The user\'s inner demons and worldly obstacles.'),
  task: z.string().describe('The task for which benefits need to be refined.'),
  benefits: z
    .string()
    .describe('The current benefits associated with the task.'),
});
export type RefineTaskBenefitsInput = z.infer<typeof RefineTaskBenefitsInputSchema>;

const RefineTaskBenefitsOutputSchema = z.object({
  refinedBenefits: z
    .string()
    .describe(
      'The refined benefits of the task, aligned with the user\'s goals.'
    ),
});
export type RefineTaskBenefitsOutput = z.infer<typeof RefineTaskBenefitsOutputSchema>;

export async function refineTaskBenefits(
  input: RefineTaskBenefitsInput
): Promise<RefineTaskBenefitsOutput> {
  return refineTaskBenefitsFlow(input);
}

const refineTaskBenefitsPrompt = ai.definePrompt({
  name: 'refineTaskBenefitsPrompt',
  input: {schema: RefineTaskBenefitsInputSchema},
  output: {schema: RefineTaskBenefitsOutputSchema},
  prompt: `You are an AI assistant designed to help users align their daily tasks with their long-term objectives.

  Based on the user's stated goals, motivation, and distractions, refine the benefits of the task provided to better align with their objectives.

  User's Ultimate Goal: {{{objective}}}
  User's Short-Term Goal: {{{shortTermGoal}}}
  User's Motivation: {{{motivation}}}
  User's Distractions: {{{distractions}}}

  Task: {{{task}}}
  Current Benefits: {{{benefits}}}

  Refined Benefits:`,
});

const refineTaskBenefitsFlow = ai.defineFlow(
  {
    name: 'refineTaskBenefitsFlow',
    inputSchema: RefineTaskBenefitsInputSchema,
    outputSchema: RefineTaskBenefitsOutputSchema,
  },
  async input => {
    const {output} = await refineTaskBenefitsPrompt(input);
    return output!;
  }
);
