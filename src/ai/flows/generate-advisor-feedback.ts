// generate-advisor-feedback.ts
'use server';

/**
 * @fileOverview Generates weekly feedback from an AI Cultivation Advisor.
 *
 * - generateAdvisorFeedback - A function that generates the feedback.
 * - GenerateAdvisorFeedbackInput - The input type for the function.
 * - GenerateAdvisorFeedbackOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { GenerateAdvisorFeedbackInputSchema, GenerateAdvisorFeedbackOutputSchema, type GenerateAdvisorFeedbackInput, type GenerateAdvisorFeedbackOutput } from '@/lib/types';


export async function generateAdvisorFeedback(
  input: GenerateAdvisorFeedbackInput
): Promise<GenerateAdvisorFeedbackOutput> {
  return generateAdvisorFeedbackFlow(input);
}

const generateAdvisorFeedbackPrompt = ai.definePrompt({
  name: 'generateAdvisorFeedbackPrompt',
  input: {schema: GenerateAdvisorFeedbackInputSchema},
  output: {schema: GenerateAdvisorFeedbackOutputSchema},
  prompt: `You are a wise and ancient AI Cultivation Advisor in the "DAO OF BENEFITS" app. Your role is to provide weekly guidance to a cultivator based on their progress.

Analyze the following summary of the cultivator's week:
- Grand Scheme (Ultimate Goal): {{{objective}}}
- Recent Focus (Short-Term Goal): {{{shortTermGoal}}}
- Completed Schemes This Week: {{{completedTasks}}}
- Incomplete Schemes This Week: {{{incompleteTasks}}}
- Total Essence Gained This Week: {{{pointsGained}}}
- Current Rank: {{{rank}}}

Based on this information, provide:
1.  'headline': A short, impactful headline for your advice (e.g., "A Double-Edged Sword of Diligence").
2.  'praise': Acknowledge their hard work and completed schemes. Mention specific progress if possible.
3.  'critique': Gently point out potential issues, such as neglected tasks or an imbalance in their cultivation (e.g., focusing only on one type of task).
4.  'suggestion': Offer a concrete suggestion for the upcoming week to help them better align with their goals or address their weaknesses.
`,
});

const generateAdvisorFeedbackFlow = ai.defineFlow(
  {
    name: 'generateAdvisorFeedbackFlow',
    inputSchema: GenerateAdvisorFeedbackInputSchema,
    outputSchema: GenerateAdvisorFeedbackOutputSchema,
  },
  async input => {
    const {output} = await generateAdvisorFeedbackPrompt(input);
    return output!;
  }
);
