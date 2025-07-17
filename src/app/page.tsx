"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Flame,
  Star,
  Skull,
  Heart,
  Target,
  BookOpen,
  Calendar,
  Sword,
  Trophy,
  Cog,
  BrainCircuit,
  Search,
  Moon,
  Sun,
  Sparkles,
  Zap,
} from "lucide-react";
import type { AppData, Task, Tribulation } from "@/lib/types";
import {
  DEFAULT_APP_DATA,
  DAYS_OF_WEEK,
  RANKS,
  ACHIEVEMENTS_CONFIG,
} from "@/lib/constants";
import { AppHeader } from "@/components/app-header";
import { EditableCard } from "@/components/dashboard/editable-card";
import { ProgressDashboard } from "@/components/dashboard/progress-dashboard";
import { FocusCard } from "@/components/dashboard/focus-card";
import { RewardCard } from "@/components/dashboard/reward-card";
import { AchievementsCard } from "@/components/dashboard/achievements-card";
import { SettingsCard } from "@/components/dashboard/settings-card";
import { SchemeCard } from "@/components/dashboard/scheme-card";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { TribulationCard } from "@/components/dashboard/tribulation-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { generateTribulationAction } from "@/app/actions";

const DATA_KEY = "essenceTrackerDataV2";

export default function Home() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const filteredWeeklyTasks = useCallback(() => {
    if (!appData) return DEFAULT_APP_DATA.weeklyTasks;
    if (!searchQuery) return appData.weeklyTasks;

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered: AppData["weeklyTasks"] = {
      monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
    };

    for (const day in appData.weeklyTasks) {
      filtered[day as keyof AppData['weeklyTasks']] = appData.weeklyTasks[day as keyof AppData['weeklyTasks']].filter(
        (task) =>
          task.text.toLowerCase().includes(lowerCaseQuery) ||
          task.benefits.toLowerCase().includes(lowerCaseQuery) ||
          task.subtasks.some(sub => sub.text.toLowerCase().includes(lowerCaseQuery))
      );
    }
    return filtered;
  }, [appData, searchQuery]);

  const loadData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(DATA_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Migration and validation
        const validatedData = { ...DEFAULT_APP_DATA, ...parsedData };
        validatedData.stats = { ...DEFAULT_APP_DATA.stats, ...parsedData.stats };
        validatedData.rewardSystem = { ...DEFAULT_APP_DATA.rewardSystem, ...parsedData.rewardSystem };
        if (!validatedData.stats.dailyProgress) validatedData.stats.dailyProgress = [];
        if (!validatedData.tribulation) validatedData.tribulation = null;
        setAppData(validatedData);
      } else {
        setAppData(JSON.parse(JSON.stringify(DEFAULT_APP_DATA)));
      }
    } catch (error) {
      console.error("Failed to load data, resetting to default.", error);
      setAppData(JSON.parse(JSON.stringify(DEFAULT_APP_DATA)));
    }
  }, []);

  useEffect(() => {
    loadData();
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, [loadData]);
  
  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (appData) {
      try {
        const dataToSave = JSON.stringify(appData);
        localStorage.setItem(DATA_KEY, dataToSave);
      } catch (error) {
        console.error("Failed to save data.", error);
      }
    }
  }, [appData]);

  const updateAppData = useCallback((updates: Partial<AppData>) => {
    setAppData((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const handleUpdateEditable = (id: string, content: string) => {
    if (appData) {
      updateAppData({ ...appData, [id]: content });
    }
  };

  const checkAchievements = useCallback((currentData: AppData): AppData => {
    const unlockedAchievements: string[] = [];
    for (const key in ACHIEVEMENTS_CONFIG) {
      if (
        !currentData.stats.achievements[key] &&
        ACHIEVEMENTS_CONFIG[key].condition(currentData)
      ) {
        currentData.stats.achievements[key] = true;
        unlockedAchievements.push(ACHIEVEMENTS_CONFIG[key].name);
      }
    }
    if (unlockedAchievements.length > 0) {
      toast({
        title: "🏆 Achievement Unlocked!",
        description: unlockedAchievements.join(", "),
      });
    }
    return currentData;
  }, [toast]);
  
  const checkRank = useCallback((currentData: AppData): AppData => {
      const { totalPoints } = currentData.stats;
      const currentRank = [...RANKS].reverse().find(r => totalPoints >= r.points);
      if (currentRank && currentData.stats.rank !== currentRank.name) {
          currentData.stats.rank = currentRank.name;
          toast({
              title: "🔥 Rank Up!",
              description: `You have achieved the rank of ${currentRank.name}.`,
          });
      }
      return currentData;
  }, [toast]);
  
  const checkStreak = useCallback((currentData: AppData): AppData => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      const lastDate = currentData.stats.lastCompletedDate ? new Date(currentData.stats.lastCompletedDate).setHours(0, 0, 0, 0) : null;
  
      if (lastDate === todayTimestamp) return currentData;
  
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
  
      if (lastDate === yesterday.getTime()) {
          currentData.stats.streak++;
      } else {
          currentData.stats.streak = 1;
      }
      currentData.stats.lastCompletedDate = todayTimestamp;
      return currentData;
  }, []);

  const updateStatsOnCompletion = useCallback((isCompleting: boolean, task: Task, currentData: AppData): AppData => {
    const points = task.actualPoints;
    let newData = { ...currentData };
    
    const todayStr = new Date().toISOString().split('T')[0];
    let todayProgress = newData.stats.dailyProgress.find(d => d.date === todayStr);

    if (isCompleting) {
        newData.stats.totalPoints += points;
        newData.rewardSystem.progress += points;
        newData.stats.allTimeTasksCompleted++;
        if (todayProgress) {
          todayProgress.points += points;
        } else {
          newData.stats.dailyProgress.push({ date: todayStr, points });
        }
        newData = checkStreak(newData);
    } else {
        newData.stats.totalPoints -= points;
        newData.rewardSystem.progress = Math.max(0, newData.rewardSystem.progress - points);
        newData.stats.allTimeTasksCompleted = Math.max(0, newData.stats.allTimeTasksCompleted - 1);
        if (todayProgress) {
          todayProgress.points = Math.max(0, todayProgress.points - points);
        }
    }
    
    newData = checkRank(newData);
    newData = checkAchievements(newData);
    return newData;
  }, [checkAchievements, checkRank, checkStreak]);


  const handleTaskAction = useCallback((action: 'add' | 'delete' | 'toggle' | 'update' | 'focus' | 'unfocus' | 'addSubtask' | 'addMultiple', payload: any) => {
    setAppData(prevData => {
        if (!prevData) return null;

        let newData = JSON.parse(JSON.stringify(prevData)) as AppData;
        const { day, task, subtaskText } = payload;

        switch (action) {
            case 'add':
                newData.weeklyTasks[day as keyof WeeklyTasks].push(task);
                newData.stats.tasksStarted++;
                break;
            
            case 'addMultiple':
                payload.tasks.forEach((t: Task) => {
                    newData.weeklyTasks[payload.day as keyof WeeklyTasks].push(t);
                    newData.stats.tasksStarted++;
                });
                break;

            case 'addSubtask':
                for (const dayKey in newData.weeklyTasks) {
                    const parentTask = newData.weeklyTasks[dayKey as keyof WeeklyTasks].find(t => t.id === payload.taskId);
                    if (parentTask) {
                        parentTask.subtasks.push({ id: Date.now(), text: subtaskText, completed: false });
                        break;
                    }
                }
                break;

            case 'toggle':
                let taskFound = false;
                for (const dayKey in newData.weeklyTasks) {
                    for (const t of newData.weeklyTasks[dayKey as keyof WeeklyTasks]) {
                        if (t.id === payload.taskId) {
                            const wasCompleted = t.completed;
                            t.completed = !t.completed;
                            t.subtasks.forEach(sub => sub.completed = t.completed);
                            newData = updateStatsOnCompletion(!wasCompleted, t, newData);
                            taskFound = true;
                            break;
                        }
                        const subTask = t.subtasks.find(s => s.id === payload.taskId);
                        if (subTask) {
                            subTask.completed = !subTask.completed;
                            if (!subTask.completed) t.completed = false;
                            taskFound = true;
                            break;
                        }
                    }
                    if (taskFound) break;
                }
                break;
            
            case 'update':
                for (const dayKey in newData.weeklyTasks) {
                    const taskIndex = newData.weeklyTasks[dayKey as keyof WeeklyTasks].findIndex(t => t.id === payload.task.id);
                    if (taskIndex !== -1) {
                        newData.weeklyTasks[dayKey as keyof WeeklyTasks][taskIndex] = payload.task;
                        break;
                    }
                }
                break;

            case 'delete':
                for (const dayKey in newData.weeklyTasks) {
                    let taskIndex = newData.weeklyTasks[dayKey as keyof WeeklyTasks].findIndex(t => t.id === payload.taskId);
                    if (taskIndex !== -1) {
                        newData.weeklyTasks[dayKey as keyof WeeklyTasks].splice(taskIndex, 1);
                        newData.top3TaskIds = newData.top3TaskIds.filter(id => id !== payload.taskId);
                        break;
                    }
                    for (const t of newData.weeklyTasks[dayKey as keyof WeeklyTasks]) {
                        const subtaskIndex = t.subtasks.findIndex(s => s.id === payload.taskId);
                        if (subtaskIndex !== -1) {
                            t.subtasks.splice(subtaskIndex, 1);
                            break;
                        }
                    }
                }
                break;
            
            case 'focus':
                if (newData.top3TaskIds.length < 3 && !newData.top3TaskIds.includes(payload.taskId)) {
                    newData.top3TaskIds.push(payload.taskId);
                } else {
                     toast({ variant: "destructive", title: "Focus list is full or scheme is already added." });
                }
                break;

            case 'unfocus':
                newData.top3TaskIds = newData.top3TaskIds.filter(id => id !== payload.taskId);
                break;
        }

        newData = checkAchievements(newData);
        return newData;
    });
}, [checkAchievements, updateStatsOnCompletion, toast]);

  const handleGenerateNewTribulation = useCallback(async () => {
    if (!appData) return;
    toast({ title: "Generating New Tribulation...", description: "The heavens are brewing a new challenge." });
    try {
      const newTribulation = await generateTribulationAction({
        rank: appData.stats.rank,
        recentAchievements: Object.keys(appData.stats.achievements).join(', '),
        objective: appData.objective,
      });
      setAppData(prevData => prevData ? ({ ...prevData, tribulation: { ...newTribulation, completed: false, failed: false, generatedDate: new Date().toISOString() }}) : null);
      toast({ title: "⚡️ Heavenly Tribulation Descends!", description: "A new challenge has appeared. Face it with courage!", className: "bg-destructive text-destructive-foreground border-destructive" });
    } catch (error) {
      console.error("Failed to generate tribulation:", error);
      toast({ variant: "destructive", title: "Generation Failed", description: "The heavens are calm for now. Please try again later." });
    }
  }, [appData, toast]);

  const handleTribulationOutcome = (outcome: 'completed' | 'failed') => {
    setAppData(prevData => {
        if (!prevData || !prevData.tribulation) return null;
        let newData = JSON.parse(JSON.stringify(prevData)) as AppData;
        const tribulation = newData.tribulation as Tribulation;
        
        if (outcome === 'completed') {
            tribulation.completed = true;
            newData.stats.totalPoints += tribulation.reward;
            toast({ title: "✨ Tribulation Survived!", description: `You have earned ${tribulation.reward} Primeval Essence!` });
        } else {
            tribulation.failed = true;
            newData.stats.totalPoints = Math.max(0, newData.stats.totalPoints - tribulation.penalty);
            toast({ variant: "destructive", title: "💔 Tribulation Failed", description: `You have lost ${tribulation.penalty} Primeval Essence.` });
        }
        
        newData = checkRank(newData);
        return newData;
    });
  };

  useEffect(() => {
    if (appData && !appData.tribulation) {
      const today = new Date();
      if (today.getDay() === 1) { // Monday
        handleGenerateNewTribulation();
      }
    } else if (appData?.tribulation?.generatedDate) {
      const generatedDate = new Date(appData.tribulation.generatedDate);
      const now = new Date();
      const diffDays = Math.ceil((now.getTime() - generatedDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
         handleGenerateNewTribulation();
      }
    }
  }, [appData, handleGenerateNewTribulation]);


  const handleWasteEssence = useCallback((amount: number, reason: string) => {
      setAppData(prevData => {
          if (!prevData) return null;
          let newData = JSON.parse(JSON.stringify(prevData)) as AppData;
          newData.stats.totalPoints -= amount;
          newData.rewardSystem.progress = Math.max(0, newData.rewardSystem.progress - amount);
          newData = checkRank(newData);
          toast({
              variant: "destructive",
              title: "Essence Wasted",
              description: `${amount} Primeval Essence deducted for: ${reason}.`,
          });
          return newData;
      });
  }, [checkRank, toast]);

  const handleRewardSystemUpdate = useCallback((newRewardSystem: Partial<AppData['rewardSystem']>) => {
      setAppData(prevData => {
          if (!prevData) return null;
          return {
              ...prevData,
              rewardSystem: {
                  ...prevData.rewardSystem,
                  ...newRewardSystem,
              }
          };
      });
  }, []);

  const handleClaimReward = useCallback(() => {
    if (appData && appData.rewardSystem.progress >= appData.rewardSystem.goal) {
      toast({
        title: "🎉 Gu Refined!",
        description: `You have claimed your reward.`,
        className: "bg-accent text-accent-foreground border-accent",
      });
      setAppData(prevData => {
        if (!prevData) return null;
        let newData = JSON.parse(JSON.stringify(prevData)) as AppData;
        newData.rewardSystem.progress = 0;
        newData.stats.rewardsClaimed++;
        newData = checkAchievements(newData);
        return newData;
      });
    }
  }, [appData, toast, checkAchievements]);

  if (!appData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <BrainCircuit className="w-12 h-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-8">
        <AppHeader />

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search schemes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={toggleTheme} variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EditableCard
            id="objective"
            title="My Grand Scheme"
            icon={<Target className="w-5 h-5 text-primary" />}
            content={appData.objective}
            placeholder="What is your ultimate goal? The Immortal Venerable throne?"
            onUpdate={handleUpdateEditable}
          />
          <EditableCard
            id="shortTermGoal"
            title="Short-Term Goal"
            icon={<Calendar className="w-5 h-5 text-primary" />}
            content={appData.shortTermGoal}
            placeholder="What is the next major step in your scheme?"
            onUpdate={handleUpdateEditable}
          />
          <EditableCard
            id="motivation"
            title="Foundation of the Dao Heart"
            icon={<Heart className="w-5 h-5 text-primary" />}
            content={appData.motivation}
            placeholder="What strengthens your will to persevere?"
            onUpdate={handleUpdateEditable}
          />
          <EditableCard
            id="distractions"
            title="Inner Demons & Worldly Obstacles"
            icon={<Skull className="w-5 h-5 text-primary" />}
            content={appData.distractions}
            placeholder="What attachments and enemies must be purged?"
            onUpdate={handleUpdateEditable}
          />
          <EditableCard
            id="todaysGoal"
            title="Today's Goal"
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            content={appData.todaysGoal}
            placeholder="What is the single most important objective for today?"
            onUpdate={handleUpdateEditable}
            className="md:col-span-2"
          />
          <EditableCard
            id="weeklyGoal"
            title="Weekly Goal"
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            content={appData.weeklyGoal}
            placeholder="What key objective must be accomplished this week?"
            onUpdate={handleUpdateEditable}
            className="md:col-span-2"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <FocusCard 
              taskIds={appData.top3TaskIds}
              allTasks={appData.weeklyTasks}
              onTaskAction={handleTaskAction}
            />
          </div>

          {appData.tribulation && (
            <div className="lg:col-span-3">
              <TribulationCard 
                tribulation={appData.tribulation} 
                onOutcome={handleTribulationOutcome}
                onGenerateNew={handleGenerateNewTribulation}
              />
            </div>
          )}

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
             <ProgressDashboard stats={appData.stats} onWasteEssence={handleWasteEssence} />
             <RewardCard 
               rewardSystem={appData.rewardSystem} 
               onUpdate={handleRewardSystemUpdate} 
               onClaim={handleClaimReward}
             />
          </div>
           <div className="lg:col-span-3">
             <LeaderboardCard userPoints={appData.stats.totalPoints} />
          </div>
          <div className="lg:col-span-3">
            <SchemeCard appData={appData} onTaskAction={handleTaskAction} filteredTasks={filteredWeeklyTasks()} />
          </div>
          <div className="lg:col-span-3">
             <AchievementsCard achievements={appData.stats.achievements} />
          </div>
           <EditableCard
            id="sacrifice"
            title="Tribulation & Sacrifice"
            icon={<Sword className="w-5 h-5 text-primary" />}
            content={appData.sacrifice}
            placeholder="What tribulations will you endure? What worldly ties will you sever?"
            onUpdate={handleUpdateEditable}
            className="lg:col-span-3"
          />
          <div className="lg:col-span-3">
            <SettingsCard appData={appData} onImport={setAppData} />
          </div>
        </div>
      </div>
    </main>
  );
}
