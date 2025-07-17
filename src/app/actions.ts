'use server';

import { refineTaskBenefits, type RefineTaskBenefitsInput, type RefineTaskBenefitsOutput } from "@/ai/flows/refine-task-benefits";

export async function refineTaskBenefitsAction(input: RefineTaskBenefitsInput): Promise<RefineTaskBenefitsOutput> {
    try {
        const result = await refineTaskBenefits(input);
        return result;
    } catch (error) {
        console.error("Error refining task benefits:", error);
        throw new Error("Failed to get refined benefits from AI.");
    }
}
