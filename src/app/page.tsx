
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

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
  Search,
  Moon,
  Sun,
  LayoutGrid,
  Users,
  BrainCircuit,
  Swords,
  LogOut,
  History,
} from "lucide-react";
import { YinYang } from "@/components/icons";
import type { AppData, Task, Tribulation, JournalEntry, Nemesis, Milestone } from "@/lib/types";
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
import { JournalCard } from "@/components/dashboard/journal-card";
import { NemesisCard } from "@/components/dashboard/nemesis-card";
import { CustomizeNemesisDialog } from "@/components/dashboard/customize-nemesis-dialog";
import { EditNemesisDialog } from "@/components/dashboard/edit-nemesis-dialog";
import { HistoryCard } from "@/components/dashboard/history-card";
import { MindPalaceCard } from "@/components/dashboard/mind-palace-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const DATA_KEY_PREFIX = "essenceTrackerDataV2";
const DEMO_DATA_KEY = "essenceTrackerDataV2_demo";

function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [appData, setAppData] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [editingNemesis, setEditingNemesis] = useState<Nemesis | null>(null);
  const { toast } = useToast();

  const getDataKey = useCallback(() => {
    return user ? `${DATA_KEY_PREFIX}_${user.id}` : DEMO_DATA_KEY;
  }, [user]);

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
    const dataKey = getDataKey();
    if (!dataKey) return;

    try {
      const savedData = localStorage.getItem(dataKey);
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
        if (!validatedData.milestones) validatedData.milestones = [];
        if (!validatedData.mindPalace) validatedData.mindPalace = { imageUrl: null, lastGenerated: null };


        setAppData(validatedData);
      } else {
        setAppData(JSON.parse(JSON.stringify(DEFAULT_APP_DATA)));
      }
    } catch (error) {
      console.error("Failed to load data, resetting to default.", error);
      setAppData(JSON.parse(JSON.stringify(DEFAULT_APP_DATA)));
    }
  }, [getDataKey]);

  useEffect(() => {
    loadData();
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, [user, loadData]);
  
  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // This effect will run after appData is updated to handle side-effects like toasts
  useEffect(() => {
    const dataKey = getDataKey();
    if (appData && dataKey) {
        try {
            const dataToSave = JSON.stringify(appData);
            localStorage.setItem(dataKey, dataToSave);
        } catch (error) {
            console.error("Failed to save data.", error);
        }

        // Handle side-effects that need to happen AFTER state update
        const toastingQueue = appData.toastingQueue;
        if (toastingQueue && toastingQueue.length > 0) {
            toastingQueue.forEach(toastInfo => toast(toastInfo));
            // Clear the queue after showing toasts
            updateAppData({ ...appData, toastingQueue: [] });
        }
    }
  }, [appData, getDataKey]);


  const updateAppData = useCallback((updates: Partial<AppData>) => {
    setAppData((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const handleUpdateEditable = (id: string, content: string) => {
    if (appData) {
      updateAppData({ ...appData, [id]: content });
    }
  };

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id' | 'date'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now() + Math.random(),
      date: new Date().toISOString(),
    };
    setAppData(prevData => {
        if (!prevData) return null;
        const newMilestones = [newMilestone, ...prevData.milestones];
        
        // Keep milestones to a reasonable number
        if(newMilestones.length > 100) {
            newMilestones.splice(100);
        }

        return { ...prevData, milestones: newMilestones };
    });
  }, []);

    const checkAchievements = useCallback((currentData: AppData): { newData: AppData, unlockedAchievementNames: string[] } => {
        const unlockedAchievementNames: string[] = [];
        for (const key in ACHIEVEMENTS_CONFIG) {
            if (
                !currentData.stats.achievements[key] &&
                ACHIEVEMENTS_CONFIG[key].condition(currentData)
            ) {
                currentData.stats.achievements[key] = true;
                unlockedAchievementNames.push(ACHIEVEMENTS_CONFIG[key].name);
            }
        }
        return { newData: currentData, unlockedAchievementNames: unlockedAchievementNames };
    }, []);
  
    const checkRank = useCallback((currentData: AppData): { newData: AppData, rankChanged: boolean, oldRank?: string } => {
        const { totalPoints } = currentData.stats;
        const currentRank = [...RANKS].reverse().find(r => totalPoints >= r.points);
        if (currentRank && currentData.stats.rank !== currentRank.name) {
            const oldRank = currentData.stats.rank;
            currentData.stats.rank = currentRank.name;
            return { newData: currentData, rankChanged: true, oldRank: oldRank };
        }
        return { newData: currentData, rankChanged: false };
    }, []);
  
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

        let newToasts = newData.toastingQueue || [];

        if (isCompleting) {
            newData.stats.totalPoints += points;
            newData.rewardSystem.progress += points;

            if (todayProgress) {
            todayProgress.points += points;
            } else {
            newData.stats.dailyProgress.push({ date: todayStr, points: points });
            }
            
            newData.stats.allTimeTasksCompleted++;
            newData = checkStreak(newData);

            addMilestone({
            type: 'TASK_COMPLETE',
            title: 'Scheme Completed: ' + task.text,
            description: `You have successfully completed a scheme and gained ${points} PE.`
        });

        } else {
            newData.stats.totalPoints -= points;
            newData.rewardSystem.progress = Math.max(0, newData.rewardSystem.progress - points);
            newData.stats.allTimeTasksCompleted = Math.max(0, newData.stats.allTimeTasksCompleted - 1);
            if (todayProgress) {
            todayProgress.points = Math.max(0, todayProgress.points - points);
            }
        }
        
        const rankCheck = checkRank(newData);
        newData = rankCheck.newData;
        if (rankCheck.rankChanged) {
            newToasts.push({
                title: "🔥 Rank Up!",
                description: `You have achieved the rank of ${newData.stats.rank}.`,
            });
             addMilestone({
                type: 'RANK_UP',
                title: 'Advanced to ' + newData.stats.rank,
                description: `You have surpassed the rank of ${rankCheck.oldRank} and achieved the status of ${newData.stats.rank}.`
            });
        }

        const achievementCheck = checkAchievements(newData);
        newData = achievementCheck.newData;
        if (achievementCheck.unlockedAchievementNames.length > 0) {
            newToasts.push({
                title: "🏆 Achievement Unlocked!",
                description: achievementCheck.unlockedAchievementNames.join(", "),
            });
        }

        newData.toastingQueue = newToasts;
        return newData;
  }, [checkAchievements, checkRank, checkStreak, addMilestone]);


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
                    newData.toastingQueue = [...(newData.toastingQueue || []), { variant: "destructive", title: "Focus list is full or scheme is already added." }];
                }
                break;

            case 'unfocus':
                newData.top3TaskIds = newData.top3TaskIds.filter(id => id !== payload.taskId);
                break;
        }

        const achievementCheck = checkAchievements(newData);
        newData = achievementCheck.newData;
        if (achievementCheck.unlockedAchievementNames.length > 0) {
            newData.toastingQueue = [...(newData.toastingQueue || []), {
                title: "🏆 Achievement Unlocked!",
                description: achievementCheck.unlockedAchievementNames.join(", "),
            }];
        }
        
        return newData;
    });
  }, [checkAchievements, updateStatsOnCompletion]);

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
        let newToasts = newData.toastingQueue || [];
        
        if (outcome === 'completed') {
            tribulation.completed = true;
            newData.stats.totalPoints += tribulation.reward;
            newToasts.push({ title: "✨ Tribulation Survived!", description: `You have earned ${tribulation.reward} Primeval Essence!` });
            addMilestone({
                type: 'TRIBULATION_COMPLETE',
                title: 'Survived Tribulation: ' + tribulation.title,
                description: `You faced the heavens and emerged victorious, earning ${tribulation.reward} PE.`
            });
        } else {
            tribulation.failed = true;
            newData.stats.totalPoints = Math.max(0, newData.stats.totalPoints - tribulation.penalty);
            newToasts.push({ variant: "destructive", title: "💔 Tribulation Failed", description: `You have lost ${tribulation.penalty} Primeval Essence.` });
            addMilestone({
                type: 'TRIBULATION_FAILED',
                title: 'Failed Tribulation: ' + tribulation.title,
                description: `You faltered before the heavens, losing ${tribulation.penalty} PE.`
            });
        }
        
        const rankCheck = checkRank(newData);
        newData = rankCheck.newData;
        if (rankCheck.rankChanged) {
            newToasts.push({
                title: "🔥 Rank Up!",
                description: `You have achieved the rank of ${newData.stats.rank}.`,
            });
             addMilestone({
                type: 'RANK_UP',
                title: 'Advanced to ' + newData.stats.rank,
                description: `You have surpassed the rank of ${rankCheck.oldRank} and achieved the status of ${newData.stats.rank}.`
            });
        }

        newData.toastingQueue = newToasts;
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
          
          let newToasts = newData.toastingQueue || [];

          const rankCheck = checkRank(newData);
          newData = rankCheck.newData;
          if (rankCheck.rankChanged) {
              newToasts.push({
                  title: "🔥 Rank Down...",
                  description: `You have fallen to the rank of ${newData.stats.rank}.`,
                  variant: "destructive"
              });
          }
          
          newToasts.push({
              variant: "destructive",
              title: "Essence Wasted",
              description: `${amount} Primeval Essence deducted for: ${reason}.`,
          });
          
          newData.toastingQueue = newToasts;
          return newData;
      });
  }, [checkRank]);

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
    setAppData(prevData => {
      if (!prevData || prevData.rewardSystem.progress < prevData.rewardSystem.goal) return prevData;
      
      let newData = JSON.parse(JSON.stringify(prevData)) as AppData;
      
      addMilestone({
          type: 'REWARD_CLAIMED',
          title: 'Refined ' + (newData.rewardSystem.text || 'a Mysterious Gu'),
          description: `You successfully refined a new Gu after accumulating ${newData.rewardSystem.goal} PE.`
      });
      
      newData.rewardSystem.progress = 0;
      newData.stats.rewardsClaimed++;

      const achievementCheck = checkAchievements(newData);
      newData = achievementCheck.newData;
      
      let newToasts = newData.toastingQueue || [];
      newToasts.push({
          title: "🎉 Gu Refined!",
          description: `You have claimed your reward.`,
          className: "bg-accent text-accent-foreground border-accent",
      });
       if (achievementCheck.unlockedAchievementNames.length > 0) {
            newToasts.push({
                title: "🏆 Achievement Unlocked!",
                description: achievementCheck.unlockedAchievementNames.join(", "),
            });
        }
      newData.toastingQueue = newToasts;

      return newData;
    });
  }, [addMilestone, checkAchievements]);

   const handleJournalUpdate = useCallback((newEntry: JournalEntry, analysis?: JournalEntry['analysis']) => {
        setAppData(prevData => {
            if (!prevData) return null;
            const existingEntryIndex = prevData.journalEntries.findIndex(e => e.id === newEntry.id);
            const newEntries = [...prevData.journalEntries];
            if (existingEntryIndex > -1) {
                newEntries[existingEntryIndex] = { ...newEntries[existingEntryIndex], ...newEntry, analysis: analysis || newEntries[existingEntryIndex].analysis };
            } else {
                newEntries.unshift({ ...newEntry, analysis });
                addMilestone({
                    type: 'JOURNAL_ENTRY',
                    title: 'Wrote a Journal Entry',
                    description: 'Recorded thoughts and reflections on the path of cultivation.'
                });
            }
            return { ...prevData, journalEntries: newEntries };
        });
    }, [addMilestone]);

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
          if (!prevData || !newNemesis) return null;
          addMilestone({
              type: 'NEMESIS_GENERATED',
              title: 'A Rival Emerges: ' + newNemesis.name,
              description: `A new fated rival, "${newNemesis.title}", has appeared on your path.`
          });
          return { ...prevData, nemesis: [...prevData.nemesis, newNemesis] };
      });
    }, [addMilestone]);
    
    const handleDeleteNemesis = useCallback((nemesisId: number) => {
      setAppData(prevData => {
          if (!prevData) return null;
          const newNemesisList = prevData.nemesis.filter(n => n.id !== nemesisId);
          return { ...prevData, nemesis: newNemesisList };
      });
    }, []);

    const handleMindPalaceUpdate = (mindPalace: AppData['mindPalace']) => {
        setAppData(prevData => prevData ? ({ ...prevData, mindPalace }) : null);
    };

    const handleResetData = () => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Action requires login",
          description: "Please sign in to reset your personal data."
        });
        return;
      }
      const dataKey = getDataKey();
      if (dataKey) {
        localStorage.removeItem(dataKey);
      }
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
              if (newNemesis) {
                handleAddNemesis(newNemesis);
              } else {
                console.error("Failed to generate nemesis: action returned undefined.");
              }
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

        const intervalId = setInterval(updateAllNemeses, 30 * 60 * 1000); // 30 minutes

        return () => clearInterval(intervalId);
    }, []);


  if (loading || !appData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <YinYang className="w-12 h-12 animate-pulse text-primary" />
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

        <Tabs defaultValue="cultivation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cultivation">
              <LayoutGrid className="mr-2" /> Cultivation
            </TabsTrigger>
            <TabsTrigger value="world">
              <Swords className="mr-2" /> World
            </TabsTrigger>
            <TabsTrigger value="mind">
              <BrainCircuit className="mr-2" /> Mind
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cultivation" className="mt-6 space-y-6">
            <FocusCard 
              taskIds={appData.top3TaskIds}
              allTasks={appData.weeklyTasks}
              onTaskAction={handleTaskAction}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressDashboard stats={appData.stats} onWasteEssence={handleWasteEssence} />
              <RewardCard 
                  rewardSystem={appData.rewardSystem} 
                  onUpdate={handleRewardSystemUpdate} 
                  onClaim={handleClaimReward}
              />
            </div>
            <SchemeCard appData={appData} onTaskAction={handleTaskAction} />
          </TabsContent>
          
          <TabsContent value="world" className="mt-6 space-y-6">
            {appData.nemesis.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {appData.nemesis.map((nemesis) => (
                      <NemesisCard key={nemesis.id} nemesis={nemesis} onEdit={() => setEditingNemesis(nemesis)} onDelete={() => handleDeleteNemesis(nemesis.id)} />
                    ))}
                </div>
            )}
            <LeaderboardCard userPoints={appData.stats.totalPoints} nemesis={appData.nemesis}/>
            {appData.tribulation && (
                <TribulationCard 
                  tribulation={appData.tribulation} 
                  onOutcome={handleTribulationOutcome}
                  onGenerateNew={handleGenerateNewTribulation}
                />
            )}
          </TabsContent>

          <TabsContent value="mind" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MindPalaceCard appData={appData} onUpdate={handleMindPalaceUpdate} />
              <HistoryCard milestones={appData.milestones} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvisorCard appData={appData} onUpdate={handleAdvisorUpdate} />
              <JournalCard entries={appData.journalEntries} onUpdate={handleJournalUpdate} />
            </div>
          </TabsContent>
        </Tabs>
        
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


export default function Home() {
  return (
      <DashboardPage />
  )
}

    

    
