'use server';

import { refineTaskBenefits, type RefineTaskBenefitsInput, type RefineTaskBenefitsOutput } from "@/ai/flows/refine-task-benefits";
import { generateSchemesForGoal } from "@/ai/flows/generate-schemes";
import { generateWeeklyTribulation, type GenerateTribulationInput, type GenerateTribulationOutput } from "@/ai/flows/generate-tribulation";
import type { GenerateSchemesInput, GenerateSchemesOutput } from "@/lib/types";

export async function refineTaskBenefitsAction(input: RefineTaskBenefitsInput): Promise<RefineTaskBenefitsOutput> {
    try {
        const result = await refineTaskBenefits(input);
        return result;
    } catch (error) {
        console.error("Error refining task benefits:", error);
        throw new Error("Failed to get refined benefits from AI.");
    }
}

export async function generateSchemesAction(input: GenerateSchemesInput): Promise<GenerateSchemesOutput> {
    try {
        const result = await generateSchemesForGoal(input);
        return result;
    } catch (error) {
        console.error("Error generating schemes:", error);
        throw new Error("Failed to get schemes from AI.");
    }
}

export async function generateTribulationAction(input: GenerateTribulationInput): Promise<GenerateTribulationOutput> {
    try {
        const result = await generateWeeklyTribulation(input);
        return result;
    } catch (error) {
        console.error("Error generating tribulation:", error);
        throw new Error("Failed to get tribulation from AI.");
    }
}
