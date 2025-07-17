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

export interface Stats {
  totalPoints: number;
  tasksStarted: number;
  allTimeTasksCompleted: number;
  rewardsClaimed: number;
  rank: string;
  streak: number;
  lastCompletedDate: number | null;
  achievements: { [key: string]: boolean };
}

export interface RewardSystem {
  text: string;
  goal: number;
  progress: number;
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
}
