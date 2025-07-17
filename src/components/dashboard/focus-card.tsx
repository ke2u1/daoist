"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import type { Task, WeeklyTasks } from "@/lib/types";

type FocusCardProps = {
  taskIds: number[];
  allTasks: WeeklyTasks;
  onTaskAction: (action: 'toggle' | 'unfocus', payload: any) => void;
};

const findTaskById = (id: number, allTasks: WeeklyTasks): Task | null => {
  for (const dayKey in allTasks) {
    const task = allTasks[dayKey].find(t => t.id === id);
    if (task) return task;
  }
  return null;
}

export function FocusCard({ taskIds, allTasks, onTaskAction }: FocusCardProps) {
  const focusedTasks = taskIds.map(id => findTaskById(id, allTasks)).filter(Boolean) as Task[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5 text-primary" />
          Today's Focus (Top 3)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {focusedTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Promote your most critical schemes here using the ⭐ icon.
          </p>
        ) : (
          <ul className="space-y-2">
            {focusedTasks.map(task => (
              <li key={task.id} className="flex items-center gap-2 p-2 rounded-md bg-card-foreground/5 border">
                <div
                  className={`w-5 h-5 rounded-full border-2 cursor-pointer flex-shrink-0 ${
                    task.completed
                      ? 'bg-accent border-accent'
                      : 'border-muted-foreground'
                  }`}
                  onClick={() => onTaskAction('toggle', { taskId: task.id })}
                >
                  {task.completed && <span className="text-white text-xs font-bold flex items-center justify-center h-full">✓</span>}
                </div>
                <span className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.text}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {task.actualPoints} PE
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onTaskAction('unfocus', { taskId: task.id })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
