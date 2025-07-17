"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge } from "lucide-react";
import type { AppData } from "@/lib/types";

type DaoChartProps = {
  appData: AppData;
};

const Node = ({ label, type, level, children }: { label: string; type: 'objective' | 'goal' | 'task'; level: number; children?: React.ReactNode }) => {
  const colors = {
    objective: "border-primary text-primary bg-primary/10",
    goal: "border-accent text-accent bg-accent/10",
    task: "border-muted-foreground text-muted-foreground bg-muted-foreground/10",
  };
  
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center self-stretch">
        <div className={`w-px h-4 ${level > 0 ? 'bg-border' : 'bg-transparent'}`}></div>
        <div className={`w-3 h-3 rounded-full ${type === 'task' ? 'bg-muted-foreground/50' : 'bg-accent'} border-2 border-background ring-1 ring-offset-0 ${type === 'task' ? 'ring-muted-foreground/50' : 'ring-accent'}`}></div>
        <div className="w-px flex-grow bg-border"></div>
      </div>
      <div className="flex-grow pb-4">
        <div className={`px-3 py-1.5 rounded-md border ${colors[type]}`}>
            <p className="font-semibold">{label}</p>
        </div>
        {children && <div className="pt-4">{children}</div>}
      </div>
    </div>
  );
};


export function DaoChart({ appData }: DaoChartProps) {
  const { objective, shortTermGoal, weeklyTasks } = appData;
  const completedTasks = Object.values(weeklyTasks).flat().filter(t => t.completed);

  return (
    <Card className="hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitMerge className="w-5 h-5 text-primary" />
          Visualization of Your Dao
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(!objective && !shortTermGoal && completedTasks.length === 0) ? (
             <p className="text-muted-foreground text-center py-10">
                Define your Grand Scheme and complete tasks to see your path unfold.
            </p>
        ) : (
            <div className="relative">
              <Node label={objective || "Grand Scheme Undefined"} type="objective" level={0}>
                <Node label={shortTermGoal || "Short-Term Goal Undefined"} type="goal" level={1}>
                  {completedTasks.length > 0 ? (
                    completedTasks.map(task => (
                      <Node key={task.id} label={task.text} type="task" level={2} />
                    ))
                  ) : (
                     <Node label="No schemes completed towards this goal yet." type="task" level={2} />
                  )}
                </Node>
              </Node>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
