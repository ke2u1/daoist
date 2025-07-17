// generate-mind-palace-image.ts
'use server';

/**
 * @fileOverview Generates an image representing the user's "Mind Palace".
 *
 * - generateMindPalaceImage - A function that generates the image.
 * - GenerateMindPalaceImageInput - The input type for the function.
 * - GenerateMindPalaceImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateMindPalaceImageInputSchema, GenerateMindPalaceImageOutputSchema, type GenerateMindPalaceImageInput, type GenerateMindPalaceImageOutput } from '@/lib/types';

export async function generateMindPalaceImage(input: GenerateMindPalaceImageInput): Promise<GenerateMindPalaceImageOutput> {
  return generateMindPalaceImageFlow(input);
}


const generateMindPalaceImageFlow = ai.defineFlow(
  {
    name: 'generateMindPalaceImageFlow',
    inputSchema: GenerateMindPalaceImageInputSchema,
    outputSchema: GenerateMindPalaceImageOutputSchema,
  },
  async ({ objective, shortTermGoal, motivation, distractions, recentMilestones }) => {
    
    const prompt = `Generate a symbolic, abstract, and visually stunning image that represents a person's inner mental world, their "Mind Palace". The style should be like a celestial nebula or a mystical landscape.

    Core elements to include:
    - A central, radiant star representing their Grand Scheme (ultimate goal): "${objective}". The brighter and more defined it is, the clearer their path.
    - A closer, glowing planet or celestial body representing their Current Objective: "${shortTermGoal}".
    - Wisps of light and energy, colored by their Dao Heart (motivation): "${motivation}".
    - Dark, swirling nebulas or shadowy chasms representing their Inner Demons (distractions): "${distractions}". These should feel like obstacles but not all-consuming.
    - Recent achievements should appear as small, bright comets or shooting stars streaking across the scene. The recent achievements are: ${recentMilestones}.
    
    The overall mood should be one of epic scale, potential, and the ongoing struggle and beauty of self-cultivation. The image should be beautiful and awe-inspiring.`;

    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: prompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return {
        imageUrl: media.url,
    };
  }
);
