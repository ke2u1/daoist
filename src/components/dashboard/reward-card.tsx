"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";
import type { RewardSystem } from "@/lib/types";

type RewardCardProps = {
  rewardSystem: RewardSystem;
  onUpdate: (updates: Partial<RewardSystem>) => void;
  onClaim: () => void;
};

export function RewardCard({ rewardSystem, onUpdate, onClaim }: RewardCardProps) {
  const { text, goal, progress } = rewardSystem;
  const percentage = goal > 0 ? Math.min((progress / goal) * 100, 100) : 0;
  const isComplete = progress >= goal;

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseInt(e.target.value, 10);
    onUpdate({ goal: isNaN(newGoal) || newGoal < 1 ? 1 : newGoal });
  };
  
  const handleTextChange = (e: React.FocusEvent<HTMLDivElement>) => {
    onUpdate({ text: e.currentTarget.innerHTML });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-primary" />
          Gu Refinement
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between">
        <div>
          <Label>Reward (Gu)</Label>
          <div
            className="editable min-h-[40px] mt-1 text-muted-foreground focus:text-foreground transition-colors rounded-md p-2 -m-2 outline-none focus:bg-white/5"
            contentEditable="true"
            data-placeholder="What Gu are you refining with this essence?"
            dangerouslySetInnerHTML={{ __html: text }}
            onBlur={handleTextChange}
          />

          <div className="flex items-center gap-2 my-4">
            <Label>Essence Required:</Label>
            <Input
              type="number"
              className="w-24 h-8"
              value={goal}
              onChange={handleGoalChange}
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <Progress value={percentage} />
            <p className="text-sm text-center text-muted-foreground">
              {isComplete ? '🎉 Gu Refinement Complete! 🎉' : `${progress} / ${goal} Essence`}
            </p>
          </div>
        </div>

        <Button onClick={onClaim} disabled={!isComplete} className="mt-4 w-full">
          Claim Refined Gu
        </Button>
      </CardContent>
    </Card>
  );
}
