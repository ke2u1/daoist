'use server';

import { refineTaskBenefits, type RefineTaskBenefitsInput, type RefineTaskBenefitsOutput } from "@/ai/flows/refine-task-benefits";
import { generateSchemesForGoal } from "@/ai/flows/generate-schemes";
import { generateWeeklyTribulation } from "@/ai/flows/generate-tribulation";
import { generateAdvisorFeedback } from "@/ai/flows/generate-advisor-feedback";
import { analyzeJournalEntry } from "@/ai/flows/analyze-journal-entry";
import { generateNemesis } from "@/ai/flows/generate-nemesis";
import { updateNemesis } from "@/ai/flows/update-nemesis";

import type { GenerateSchemesInput, GenerateSchemesOutput, GenerateTribulationInput, GenerateTribulationOutput, GenerateAdvisorFeedbackInput, GenerateAdvisorFeedbackOutput, AnalyzeJournalEntryInput, AnalyzeJournalEntryOutput, GenerateNemesisInput, GenerateNemesisOutput, UpdateNemesisInput, UpdateNemesisOutput } from "@/lib/types";

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

export async function generateAdvisorFeedbackAction(input: GenerateAdvisorFeedbackInput): Promise<GenerateAdvisorFeedbackOutput> {
    try {
        const result = await generateAdvisorFeedback(input);
        return result;
    } catch (error) {
        console.error("Error generating advisor feedback:", error);
        throw new Error("Failed to get feedback from AI.");
    }
}

export async function analyzeJournalEntryAction(input: AnalyzeJournalEntryInput): Promise<AnalyzeJournalEntryOutput> {
    try {
        const result = await analyzeJournalEntry(input);
        return result;
    } catch (error) {
        console.error("Error analyzing journal entry:", error);
        throw new Error("Failed to get analysis from AI.");
    }
}

export async function generateNemesisAction(input: GenerateNemesisInput): Promise<GenerateNemesisOutput> {
    try {
        const result = await generateNemesis(input);
        return result;
    } catch (error) {
        console.error("Error generating nemesis:", error);
        throw new Error("Failed to generate nemesis from AI.");
    }
}

export async function updateNemesisAction(input: UpdateNemesisInput): Promise<UpdateNemesisOutput> {
    try {
        const result = await updateNemesis(input);
        return result;
    } catch (error) {
        console.error("Error updating nemesis:", error);
        throw new Error("Failed to update nemesis from AI.");
    }
}
