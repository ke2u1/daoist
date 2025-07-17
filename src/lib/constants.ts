import type { AppData } from './types';

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DIFFICULTY_POINTS: { [key: string]: number } = {
  easy: 1,
  medium: 5,
  hard: 10,
  scene: 50,
  "venerable-scene": 100,
};

export const RANKS = [
  { points: -Infinity, name: "Qi Deviant" },
  { points: 0, name: "Recruit" },
  { points: 100, name: "Rank 1 Novice" },
  { points: 200, name: "Rank 2 Master" },
  { points: 400, name: "Rank 3 Elder" },
  { points: 800, name: "Rank 4 King" },
  { points: 1600, name: "Rank 5 Emperor" },
  { points: 3200, name: "Rank 6 Immortal" },
  { points: 6400, name: "Rank 7 Taoist" },
  { points: 12800, name: "Rank 8 Overlord" },
  { points: 25600, name: "Rank 9 Venerable" },
  { points: 51200, name: "Rank 10 Eternal" },
];

export const ACHIEVEMENTS_CONFIG: { [key: string]: { name: string; description: string; condition: (data: AppData) => boolean } } = {
  first_benefit: {
    name: "Calculating Mind",
    description: "Define the benefits for your first scheme.",
    condition: (data) =>
      Object.values(data.weeklyTasks)
        .flat()
        .some((t) => t.benefits && t.benefits.length > 0),
  },
  first_task: {
    name: "First Blood",
    description: "Complete your first scheme.",
    condition: (data) => data.stats.allTimeTasksCompleted >= 1,
  },
  ten_tasks: {
    name: "Warrior",
    description: "Complete 10 schemes.",
    condition: (data) => data.stats.allTimeTasksCompleted >= 10,
  },
  fifty_tasks: {
    name: "Veteran",
    description: "Complete 50 schemes.",
    condition: (data) => data.stats.allTimeTasksCompleted >= 50,
  },
  first_hard: {
    name: "Berserker",
    description: "Complete a Heavenly-level scheme.",
    condition: (data) =>
      Object.values(data.weeklyTasks)
        .flat()
        .some(
          (t) =>
            t.completed &&
            (t.difficulty === "hard" || t.actualPoints >= 10)
        ),
  },
  streak_7: {
    name: "Relentless",
    description: "Maintain a 7-day streak.",
    condition: (data) => data.stats.streak >= 7,
  },
  first_reward: {
    name: "Just Rewards",
    description: "Refine your first Gu.",
    condition: (data) => data.stats.rewardsClaimed >= 1,
  },
};

export const DEFAULT_APP_DATA: AppData = {
  objective: "",
  shortTermGoal: "",
  todaysGoal: "",
  weeklyGoal: "",
  motivation: "",
  distractions: "",
  sacrifice: "",
  weeklyTasks: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  top3TaskIds: [],
  stats: {
    totalPoints: 0,
    tasksStarted: 0,
    allTimeTasksCompleted: 0,
    rewardsClaimed: 0,
    rank: "Recruit",
    streak: 0,
    lastCompletedDate: null,
    achievements: {},
  },
  rewardSystem: { text: "", goal: 50, progress: 0 },
};
