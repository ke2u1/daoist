import { z } from 'zod';

export interface SubTask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  text: string;
  benefits: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'scene' | 'venerable-scene';
  actualPoints: number;
  subtasks: SubTask[];
}

export interface WeeklyTasks {
  [key: string]: Task[];
}

export interface DailyProgress {
    date: string; // "YYYY-MM-DD"
    points: number;
}

export interface Stats {
  totalPoints: number;
  tasksStarted: number;
  allTimeTasksCompleted: number;
  rewardsClaimed: number;
  rank: string;
  streak: number;
  lastCompletedDate: number | null;
  achievements: { [key: string]: boolean };
  dailyProgress: DailyProgress[];
  dailyEssenceCapacity: number;
  currentEssenceEarnedToday: number;
  lastDateForEssence: string; // "YYYY-MM-DD"
}

export interface RewardSystem {
  text: string;
  goal: number;
  progress: number;
}

export interface Tribulation {
  title: string;
  description: string;
  reward: number;
  penalty: number;
  completed: boolean;
  failed: boolean;
  generatedDate: string;
}

export interface JournalEntry {
    id: number;
    date: string; // ISO string
    content: string;
    analysis?: {
        sentiment: 'positive' | 'negative' | 'neutral';
        themes: string[];
    }
}

export interface AdvisorFeedback {
    headline: string;
    praise: string;
    critique: string;
    suggestion: string;
    generatedDate: string; // ISO string
}

export interface Nemesis {
    name: string;
    title: string;
    rank: string;
    points: number;
    backstory: string;
    lastAction: string;
    lastUpdated: string; // ISO string
}

export interface AppData {
  objective: string;
  shortTermGoal: string;
  todaysGoal: string;
  weeklyGoal: string;
  motivation: string;
  distractions: string;
  sacrifice: string;
  weeklyTasks: WeeklyTasks;
  top3TaskIds: number[];
  stats: Stats;
  rewardSystem: RewardSystem;
  tribulation: Tribulation | null;
  journalEntries: JournalEntry[];
  advisor: AdvisorFeedback | null;
  nemesis: Nemesis | null;
}

// AI Schema Types

export const GenerateSchemesInputSchema = z.object({
  goal: z.string().describe('The user\'s goal for which to generate tasks.'),
  objective: z.string().describe('The user\'s ultimate long-term goal or grand scheme.'),
  shortTermGoal: z.string().describe('The user\'s short-term goal or next major step.'),
});
export type GenerateSchemesInput = z.infer<typeof GenerateSchemesInputSchema>;

const difficultyEnum = z.enum(['easy', 'medium', 'hard', 'scene', 'venerable-scene']);

const GeneratedTaskSchema = z.object({
    text: z.string().describe("The description of the task or scheme."),
    benefits: z.string().describe("The detailed benefits of completing this task."),
    difficulty: difficultyEnum.describe("The difficulty of the task."),
    actualPoints: z.number().describe("The Primeval Essence (points) awarded for completing the task, based on its difficulty."),
});

export const GenerateSchemesOutputSchema = z.object({
  schemes: z.array(GeneratedTaskSchema).describe('A list of 3 to 5 generated schemes to help the user achieve their goal.'),
});
export type GenerateSchemesOutput = z.infer<typeof GenerateSchemesOutputSchema>;


export const GenerateTribulationInputSchema = z.object({
  rank: z.string().describe("The user's current cultivation rank."),
  recentAchievements: z.string().describe('A comma-separated list of recent achievements.'),
  objective: z.string().describe("The user's ultimate long-term goal."),
});
export type GenerateTribulationInput = z.infer<typeof GenerateTribulationInputSchema>;

export const GenerateTribulationOutputSchema = z.object({
  title: z.string().describe("The name of the tribulation (e.g., 'The Trial of the Shattered Dao Heart')."),
  description: z.string().describe("A thematic description of the challenge, what the user must do to overcome it."),
  reward: z.number().describe("The amount of Primeval Essence rewarded for success."),
  penalty: z.number().describe("The amount of Primeval Essence lost on failure."),
});
export type GenerateTribulationOutput = z.infer<typeof GenerateTribulationOutputSchema>;

export const GenerateAdvisorFeedbackInputSchema = z.object({
    objective: z.string(),
    shortTermGoal: z.string(),
    completedTasks: z.string().describe("Comma-separated list of completed tasks this week."),
    incompleteTasks: z.string().describe("Comma-separated list of incomplete tasks this week."),
    pointsGained: z.number(),
    rank: z.string(),
});
export type GenerateAdvisorFeedbackInput = z.infer<typeof GenerateAdvisorFeedbackInputSchema>;

export const GenerateAdvisorFeedbackOutputSchema = z.object({
    headline: z.string().describe("A short, impactful headline for the advice."),
    praise: z.string().describe("Acknowledgement of the user's hard work and progress."),
    critique: z.string().describe("Gentle critique on potential issues or imbalances."),
    suggestion: z.string().describe("A concrete suggestion for the upcoming week."),
});
export type GenerateAdvisorFeedbackOutput = z.infer<typeof GenerateAdvisorFeedbackOutputSchema>;

export const AnalyzeJournalEntryInputSchema = z.object({
    entry: z.string().describe("The user's journal entry to be analyzed."),
});
export type AnalyzeJournalEntryInput = z.infer<typeof AnalyzeJournalEntryInputSchema>;

export const AnalyzeJournalEntryOutputSchema = z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']).describe("The overall sentiment of the journal entry."),
    themes: z.array(z.string()).describe("Up to three key themes or recurring thoughts from the entry."),
});
export type AnalyzeJournalEntryOutput = z.infer<typeof AnalyzeJournalEntryOutputSchema>;

// Nemesis Schemas
export const GenerateNemesisInputSchema = z.object({
    userRank: z.string().describe("The user's current rank to calibrate the nemesis's strength."),
    objective: z.string().describe("The user's ultimate goal to create a relevant rival."),
    shortTermGoal: z.string().describe("The user's short-term goal to create a relevant rival."),
});
export type GenerateNemesisInput = z.infer<typeof GenerateNemesisInputSchema>;

export const NemesisSchema = z.object({
    name: z.string().describe("A plausible real-world name for the nemesis (e.g., 'Alex Chen')."),
    title: z.string().describe("An impressive-sounding title related to their real-world goals (e.g., 'Founder at Zenith Labs')."),
    rank: z.string().describe("The nemesis's current rank, which should be similar to the user's rank."),
    points: z.number().describe("The nemesis's starting Primeval Essence, close to the user's current rank requirements."),
    backstory: z.string().describe("A short, compelling backstory about why this person is the user's rival in the real world, based on the user's goals."),
    lastAction: z.string().describe("A sentence describing a recent, impressive, real-world feat (e.g., 'secured a new round of funding')."),
    lastUpdated: z.string().describe("The ISO string of when the nemesis was created."),
});
export type GenerateNemesisOutput = z.infer<typeof NemesisSchema>;

export const UpdateNemesisInputSchema = z.object({
    nemesis: NemesisSchema,
});
export type UpdateNemesisInput = z.infer<typeof UpdateNemesisInputSchema>;
export type UpdateNemesisOutput = z.infer<typeof NemesisSchema>;
