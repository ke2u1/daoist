"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star, CheckSquare, Square } from "lucide-react";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type SearchResultsCardProps = {
  tasks: (Task & { day: string })[];
  onTaskAction: (action: string, payload: any) => void;
};

export function SearchResultsCard({ tasks, onTaskAction }: SearchResultsCardProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle>Search Results ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/10 transition-colors">
                <button onClick={() => onTaskAction('toggle', { taskId: task.id })}>
                    {task.completed ? <CheckSquare className="w-5 h-5 text-accent" /> : <Square className="w-5 h-5 text-muted-foreground" />}
                </button>
                <div className="flex-grow">
                    <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>{task.text}</p>
                    <p className="text-xs text-muted-foreground capitalize">{task.day}</p>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Add to Focus" onClick={() => onTaskAction('focus', { taskId: task.id })}>
                        <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" title="Delete Task" onClick={() => onTaskAction('delete', { taskId: task.id })}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No schemes found matching your query.</p>
        )}
      </CardContent>
    </Card>
  );
}
