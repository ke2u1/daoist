"use client";

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAdvisorFeedbackAction } from "@/app/actions";
import type { AppData } from "@/lib/types";

type AdvisorCardProps = {
  appData: AppData;
  onUpdate: (advisor: AppData['advisor']) => void;
};

export function AdvisorCard({ appData, onUpdate }: AdvisorCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { advisor } = appData;

  const handleGenerateFeedback = useCallback(async () => {
    setIsLoading(true);
    toast({ title: "Consulting the Venerable Advisor...", description: "Please wait while wisdom is being distilled." });

    try {
      // Summarize weekly progress
      const allTasks = Object.values(appData.weeklyTasks).flat();
      const completedTasks = allTasks.filter(t => t.completed).map(t => t.text).join(', ') || 'None';
      const incompleteTasks = allTasks.filter(t => !t.completed).map(t => t.text).join(', ') || 'None';
      const pointsGained = appData.stats.dailyProgress.slice(-7).reduce((sum, day) => sum + day.points, 0);

      const feedback = await generateAdvisorFeedbackAction({
        objective: appData.objective,
        shortTermGoal: appData.shortTermGoal,
        completedTasks,
        incompleteTasks,
        pointsGained,
        rank: appData.stats.rank,
      });

      onUpdate({ ...feedback, generatedDate: new Date().toISOString() });
      toast({ title: "📜 Advisor's Insight Received", description: "New guidance has been provided for your journey." });

    } catch (error) {
      console.error("Failed to generate advisor feedback:", error);
      toast({ variant: "destructive", title: "Generation Failed", description: "The advisor is currently in seclusion. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  }, [appData, onUpdate, toast]);

  // Auto-generate on Monday if no feedback exists or it's older than a week
  useEffect(() => {
    const today = new Date();
    if (!advisor) {
      if (today.getDay() === 1) { // Monday
        handleGenerateFeedback();
      }
    } else if (advisor.generatedDate) {
      const generatedDate = new Date(advisor.generatedDate);
      const diffDays = Math.ceil((today.getTime() - generatedDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        handleGenerateFeedback();
      }
    }
  }, [advisor, handleGenerateFeedback]);

  return (
    <Card className="bg-card border-border hover:bg-card/95 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BrainCircuit className="w-5 h-5" />
          Venerable Advisor's Weekly Insight
        </CardTitle>
        <CardDescription>Guidance forged from the echoes of your actions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && !advisor && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p>The advisor is contemplating your destiny...</p>
          </div>
        )}
        {advisor ? (
          <div>
            <h3 className="text-xl font-bold mb-3 text-foreground">{advisor.headline}</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-green-400">Praise</h4>
                    <p className="text-muted-foreground text-sm pl-4 border-l-2 border-green-400/50 py-1">{advisor.praise}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-amber-400">Critique</h4>
                    <p className="text-muted-foreground text-sm pl-4 border-l-2 border-amber-400/50 py-1">{advisor.critique}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-cyan-400">Suggestion</h4>
                    <p className="text-muted-foreground text-sm pl-4 border-l-2 border-cyan-400/50 py-1">{advisor.suggestion}</p>
                </div>
            </div>
          </div>
        ) : !isLoading && (
          <div className="text-center text-muted-foreground h-32 flex flex-col items-center justify-center">
            <p>No guidance available. Seek the advisor's wisdom to begin.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateFeedback} disabled={isLoading} className="ml-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Request New Guidance
        </Button>
      </CardFooter>
    </Card>
  );
}
