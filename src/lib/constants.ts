

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

export const VENERABLES = [
    { name: "Primordial Origin", points: 1000000, id: -1 },
    { name: "Star Constellation", points: 950000, id: -2 },
    { name: "Limitless", points: 920000, id: -3 },
    { name: "Reckless Savage", points: 880000, id: -4 },
    { name: "Red Lotus", points: 850000, id: -5 },
    { name: "Genesis Lotus", points: 820000, id: -6 },
    { name: "Thieving Heaven", points: 800000, id: -7 },
    { name: "Giant Sun", points: 780000, id: -8 },
    { name: "Spectral Soul", points: 760000, id: -9 },
    { name: "Paradise Earth", points: 740000, id: -10 },
    { name: "Great Dream", points: 720000, id: -11 },
    { name: "Fang Yuan", points: 700000, id: -12 },
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
  tribulation_survived: {
    name: "Heaven Defying",
    description: "Survive your first Heavenly Tribulation.",
    condition: (data) => data.tribulation?.completed === true,
  },
   first_journal: {
    name: "Inner Reflections",
    description: "Write your first journal entry.",
    condition: (data) => data.journalEntries.length > 0,
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
    dailyProgress: [],
  },
  rewardSystem: { text: "", goal: 50, progress: 0 },
  tribulation: null,
  journalEntries: [],
  advisor: null,
  nemesis: [],
  milestones: [],
  mindPalace: {
      imageUrl: null,
      lastGenerated: null,
  },
  toastingQueue: [],
};

    
