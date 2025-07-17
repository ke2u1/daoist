'use server';

import { refineTaskBenefits, type RefineTaskBenefitsInput, type RefineTaskBenefitsOutput } from "@/ai/flows/refine-task-benefits";
import { generateSchemesForGoal } from "@/ai/flows/generate-schemes";
import { generateWeeklyTribulation } from "@/ai/flows/generate-tribulation";
import { generateAdvisorFeedback } from "@/ai/flows/generate-advisor-feedback";
import { analyzeJournalEntry } from "@/ai/flows/analyze-journal-entry";

import type { GenerateSchemesInput, GenerateSchemesOutput, GenerateTribulationInput, GenerateTribulationOutput, GenerateAdvisorFeedbackInput, GenerateAdvisorFeedbackOutput, AnalyzeJournalEntryInput, AnalyzeJournalEntryOutput } from "@/lib/types";

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
