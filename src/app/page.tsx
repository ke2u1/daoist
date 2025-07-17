
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
  LayoutGrid
} from "lucide-react";
import type { AppData, Task, Tribulation, JournalEntry, Nemesis } from "@/lib/types";
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
import { generateTribulationAction, generateNemesisAction, updateNemesisAction, customizeNemesisAction } from "@/app/actions";
import { SearchResultsCard } from "@/components/dashboard/search-results-card";
import { AdvisorCard } from "@/components/dashboard/advisor-card";
import { DaoChart } from "@/components/dashboard/dao-chart";
import { JournalCard } from "@/components/dashboard/journal-card";
import { NemesisCard } from "@/components/dashboard/nemesis-card";
import { ApertureCard } from "@/components/dashboard/aperture-card";
import { CustomizeNemesisDialog } from "@/components/dashboard/customize-nemesis-dialog";
import { EditNemesisDialog } from "@/components/dashboard/edit-nemesis-dialog";


const DATA_KEY = "essenceTrackerDataV2";

export default function Home() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [editingNemesis, setEditingNemesis] = useState<Nemesis | null>(null);
  const { toast } = useToast();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const filteredTasks = useCallback(() => {
    if (!appData || !searchQuery) return [];
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const allTasks: (Task & {day: string})[] = [];

    for (const day in appData.weeklyTasks) {
       appData.weeklyTasks[day as keyof AppData['weeklyTasks']].forEach(task => {
         allTasks.push({...task, day: day});
       });
    }

    return allTasks.filter(
        (task) =>
          task.text.toLowerCase().includes(lowerCaseQuery) ||
          task.benefits.toLowerCase().includes(lowerCaseQuery) ||
          task.subtasks.some(sub => sub.text.toLowerCase().includes(lowerCaseQuery))
      );
  }, [appData, searchQuery]);

  const loadData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(DATA_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Migration and validation
        let validatedData = { ...DEFAULT_APP_DATA, ...parsedData };
        validatedData.stats = { ...DEFAULT_APP_DATA.stats, ...parsedData.stats };
        validatedData.rewardSystem = { ...DEFAULT_APP_DATA.rewardSystem, ...parsedData.rewardSystem };
        if (!validatedData.stats.dailyProgress) validatedData.stats.dailyProgress = [];
        if (!validatedData.tribulation) validatedData.tribulation = null;
        if (!validatedData.journalEntries) validatedData.journalEntries = [];
        if (!validatedData.advisor) validatedData.advisor = null;
        if (!validatedData.nemesis) validatedData.nemesis = []; // Updated for multiple rivals
        if (typeof validatedData.nemesis === 'object' && validatedData.nemesis !== null && !Array.isArray(validatedData.nemesis)) {
           validatedData.nemesis = [validatedData.nemesis]; // Convert old single nemesis to array
        }


        // Reset daily essence if it's a new day
        const todayStr = new Date().toISOString().split('T')[0];
        if (validatedData.stats.lastDateForEssence !== todayStr) {
            validatedData.stats.currentEssenceEarnedToday = 0;
            validatedData.stats.lastDateForEssence = todayStr;
        }

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
        const essenceToEarn = Math.min(points, newData.stats.dailyEssenceCapacity - newData.stats.currentEssenceEarnedToday);
        if (essenceToEarn < points) {
            toast({
                title: "Aperture Limit Reached",
                description: `You can only absorb ${essenceToEarn} more Essence today. Complete this scheme tomorrow for full benefits.`,
                variant: "destructive"
            });
        }
        
        if (essenceToEarn > 0) {
            newData.stats.totalPoints += essenceToEarn;
            newData.stats.currentEssenceEarnedToday += essenceToEarn;
            newData.rewardSystem.progress += essenceToEarn;

            if (todayProgress) {
              todayProgress.points += essenceToEarn;
            } else {
              newData.stats.dailyProgress.push({ date: todayStr, points: essenceToEarn });
            }
        }
        
        newData.stats.allTimeTasksCompleted++;
        newData = checkStreak(newData);
    } else {
        // Note: Un-completing doesn't refund essence to the daily capacity to prevent exploitation.
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
  }, [checkAchievements, checkRank, checkStreak, toast]);


  const handleTaskAction = useCallback((action: 'add' | 'delete' | 'toggle' | 'update' | 'focus' | 'unfocus' | 'addSubtask' | 'addMultiple', payload: any) => {
    setAppData(prevData => {
        if (!prevData) return null;

        let newData = JSON.parse(JSON.stringify(prevData)) as AppData;
        const { day, task, subtaskText } = payload;
        const dayKeyTyped = day as keyof AppData['weeklyTasks'];

        switch (action) {
            case 'add':
                newData.weeklyTasks[dayKeyTyped].push(task);
                newData.stats.tasksStarted++;
                break;
            
            case 'addMultiple':
                payload.tasks.forEach((t: Task) => {
                    newData.weeklyTasks[dayKeyTyped].push(t);
                    newData.stats.tasksStarted++;
                });
                break;

            case 'addSubtask':
                for (const dayKey in newData.weeklyTasks) {
                    const parentTask = newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']].find(t => t.id === payload.taskId);
                    if (parentTask) {
                        parentTask.subtasks.push({ id: Date.now(), text: subtaskText, completed: false });
                        break;
                    }
                }
                break;

            case 'toggle':
                let taskFound = false;
                for (const dayKey in newData.weeklyTasks) {
                    for (const t of newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']]) {
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
                    const taskIndex = newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']].findIndex(t => t.id === payload.task.id);
                    if (taskIndex !== -1) {
                        newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']][taskIndex] = payload.task;
                        break;
                    }
                }
                break;

            case 'delete':
                for (const dayKey in newData.weeklyTasks) {
                    let taskIndex = newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']].findIndex(t => t.id === payload.taskId);
                    if (taskIndex !== -1) {
                        newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']].splice(taskIndex, 1);
                        newData.top3TaskIds = newData.top3TaskIds.filter(id => id !== payload.taskId);
                        break;
                    }
                    for (const t of newData.weeklyTasks[dayKey as keyof AppData['weeklyTasks']]) {
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
      if (diffDays > 7 && !appData.tribulation.completed && !appData.tribulation.failed) {
         handleTribulationOutcome('failed'); // Auto-fail after 7 days
      } else if (diffDays > 7) {
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

   const handleJournalUpdate = useCallback((newEntry: JournalEntry, analysis?: JournalEntry['analysis']) => {
        setAppData(prevData => {
            if (!prevData) return null;
            const existingEntryIndex = prevData.journalEntries.findIndex(e => e.id === newEntry.id);
            const newEntries = [...prevData.journalEntries];
            if (existingEntryIndex > -1) {
                newEntries[existingEntryIndex] = { ...newEntries[existingEntryIndex], ...newEntry, analysis: analysis || newEntries[existingEntryIndex].analysis };
            } else {
                newEntries.unshift({ ...newEntry, analysis });
            }
            return { ...prevData, journalEntries: newEntries };
        });
    }, []);

    const handleAdvisorUpdate = useCallback((newAdvisor: AppData['advisor']) => {
        setAppData(prevData => prevData ? ({ ...prevData, advisor: newAdvisor }) : null);
    }, []);

    const handleNemesisUpdate = useCallback((updatedNemesis: Nemesis) => {
      setAppData(prevData => {
          if (!prevData) return null;
          const newNemesisList = [...prevData.nemesis];
          const index = newNemesisList.findIndex(n => n.id === updatedNemesis.id);
          if (index !== -1) {
              newNemesisList[index] = updatedNemesis;
          }
          return { ...prevData, nemesis: newNemesisList };
      });
    }, []);

    const handleAddNemesis = useCallback((newNemesis: Nemesis) => {
      setAppData(prevData => {
          if (!prevData) return null;
          return { ...prevData, nemesis: [...prevData.nemesis, newNemesis] };
      });
    }, []);
    
    const handleDeleteNemesis = useCallback((nemesisId: number) => {
      setAppData(prevData => {
          if (!prevData) return null;
          const newNemesisList = prevData.nemesis.filter(n => n.id !== nemesisId);
          return { ...prevData, nemesis: newNemesisList };
      });
    }, []);

    const handleResetData = () => {
      localStorage.removeItem(DATA_KEY);
      setAppData(JSON.parse(JSON.stringify(DEFAULT_APP_DATA)));
      toast({
        title: "Progress Reset",
        description: "Your cultivation journey has begun anew."
      });
    }

    // Effect for automatic nemesis generation
    useEffect(() => {
      if (!appData) return;

      const handleGenerateFirstNemesis = async () => {
          if (appData.nemesis.length > 0 || appData.stats.rank === 'Recruit') return;
          toast({ title: "A Rival Emerges...", description: "A new challenger appears on your path." });
          try {
              const newNemesis = await generateNemesisAction({ 
                  userRank: appData.stats.rank,
                  objective: appData.objective,
                  shortTermGoal: appData.shortTermGoal,
              });
              handleAddNemesis(newNemesis);
          } catch (error) {
              console.error("Failed to generate nemesis:", error);
          }
      };

      handleGenerateFirstNemesis();
    }, [appData?.stats.rank, appData?.objective, appData?.shortTermGoal, appData?.nemesis.length, handleAddNemesis]);

    // Effect for periodic nemesis updates.
    useEffect(() => {
        const updateAllNemeses = async () => {
            console.log("Checking for rival updates...");
            setAppData(currentData => {
                if (!currentData || currentData.nemesis.length === 0) {
                    return currentData;
                }
                
                (async () => {
                    const updatePromises = currentData.nemesis.map(nemesis => 
                        updateNemesisAction({ nemesis }).catch(error => {
                            console.error(`Failed to update nemesis ${nemesis.name}:`, error);
                            return null;
                        })
                    );

                    const updatedNemeses = await Promise.all(updatePromises);
                    
                    setAppData(prevData => {
                        if (!prevData) return null;
                        const newNemesisList = [...prevData.nemesis];
                        let changed = false;
                        updatedNemeses.forEach(updatedNemesis => {
                            if (updatedNemesis) {
                                const index = newNemesisList.findIndex(n => n.id === updatedNemesis.id);
                                if (index !== -1) {
                                    newNemesisList[index] = updatedNemesis;
                                    changed = true;
                                }
                            }
                        });
                        if(changed) {
                            console.log("Rivals updated.");
                            return { ...prevData, nemesis: newNemesisList };
                        }
                        return prevData;
                    });
                })();
                
                return currentData;
            });
        };

        const intervalId = setInterval(updateAllNemeses, 60 * 1000); // 1 minute

        return () => clearInterval(intervalId);
    }, []);


  if (!appData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <BrainCircuit className="w-12 h-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-8">
        <AppHeader />

        <div className="sticky top-4 z-10 flex flex-col sm:flex-row gap-4 items-center bg-background/80 backdrop-blur-sm p-4 -m-4 rounded-lg border">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search schemes..."
              className="pl-10 h-11 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              spellCheck="false"
            />
          </div>
          <Button onClick={toggleTheme} variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {searchQuery && (
          <SearchResultsCard 
            tasks={filteredTasks()}
            onTaskAction={handleTaskAction} 
          />
        )}

        {/* Core Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EditableCard
            id="objective"
            title="My Grand Scheme"
            icon={<Target className="w-5 h-5 text-primary" />}
            content={appData.objective}
            placeholder="What is your ultimate goal?"
            onUpdate={handleUpdateEditable}
            className="lg:col-span-2"
          />
          <EditableCard
            id="shortTermGoal"
            title="Current Objective"
            icon={<Calendar className="w-5 h-5 text-primary" />}
            content={appData.shortTermGoal}
            placeholder="What is the next major step?"
            onUpdate={handleUpdateEditable}
            className="lg:col-span-2"
          />
          <EditableCard
            id="motivation"
            title="Dao Heart"
            icon={<Heart className="w-5 h-5 text-primary" />}
            content={appData.motivation}
            placeholder="What strengthens your will?"
            onUpdate={handleUpdateEditable}
            className="lg:col-span-2"
          />
          <EditableCard
            id="distractions"
            title="Inner Demons"
            icon={<Skull className="w-5 h-5 text-primary" />}
            content={appData.distractions}
            placeholder="What obstacles must be purged?"
            onUpdate={handleUpdateEditable}
            className="lg:col-span-2"
          />
        </div>

        {/* Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <FocusCard 
                taskIds={appData.top3TaskIds}
                allTasks={appData.weeklyTasks}
                onTaskAction={handleTaskAction}
              />
            </div>
            
            <ProgressDashboard stats={appData.stats} onWasteEssence={handleWasteEssence} />
            <ApertureCard stats={appData.stats} />
            <RewardCard 
                rewardSystem={appData.rewardSystem} 
                onUpdate={handleRewardSystemUpdate} 
                onClaim={handleClaimReward}
            />

            {appData.nemesis.length > 0 && (
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appData.nemesis.map((nemesis) => (
                    <NemesisCard key={nemesis.id} nemesis={nemesis} onEdit={() => setEditingNemesis(nemesis)} onDelete={() => handleDeleteNemesis(nemesis.id)} />
                  ))}
              </div>
            )}
            
            <div className="lg:col-span-3">
              <LeaderboardCard userPoints={appData.stats.totalPoints} nemesis={appData.nemesis}/>
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
        </div>

        {/* Schemes and Planning */}
        <div className="grid grid-cols-1 gap-6">
          <SchemeCard appData={appData} onTaskAction={handleTaskAction} />
        </div>

        {/* AI & Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
                <AdvisorCard appData={appData} onUpdate={handleAdvisorUpdate} />
            </div>
            <DaoChart appData={appData} />
            <JournalCard entries={appData.journalEntries} onUpdate={handleJournalUpdate} />
        </div>
        
        {/* Achievements & Settings */}
        <div className="grid grid-cols-1 gap-6">
            <AchievementsCard achievements={appData.stats.achievements} />
            <SettingsCard appData={appData} onImport={setAppData} onReset={handleResetData} onAddRival={handleAddNemesis} />
        </div>

        {editingNemesis && appData && (
          <EditNemesisDialog
            isOpen={!!editingNemesis}
            onOpenChange={(isOpen) => { if (!isOpen) setEditingNemesis(null); }}
            nemesis={editingNemesis}
            appData={appData}
            onUpdate={handleNemesisUpdate}
          />
        )}
      </div>
    </main>
  );
}
