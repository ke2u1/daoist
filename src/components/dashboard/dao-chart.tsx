
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitMerge, CheckCircle2, Circle } from "lucide-react";
import type { AppData, Task, SubTask } from "@/lib/types";
import { cn } from "@/lib/utils";

type NodeProps = {
  label: string;
  type: 'objective' | 'goal' | 'task' | 'subtask';
  level: number;
  completed?: boolean;
  children?: React.ReactNode;
};

const Node = ({ label, type, level, completed, children }: NodeProps) => {
    const typeStyles = {
        objective: {
            icon: <GitMerge className="w-4 h-4 text-primary" />,
            text: "text-primary font-bold",
            border: "border-primary",
            bg: "bg-primary/10",
        },
        goal: {
            icon: <GitMerge className="w-4 h-4 text-accent" />,
            text: "text-accent font-semibold",
            border: "border-accent",
            bg: "bg-accent/10",
        },
        task: {
            icon: completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-muted-foreground" />,
            text: cn("font-medium", completed ? "text-green-400 line-through" : "text-foreground"),
            border: "border-border",
            bg: "bg-card/50",
        },
        subtask: {
            icon: completed ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Circle className="w-3 h-3 text-muted-foreground/70" />,
            text: cn("text-sm", completed ? "text-green-400/80 line-through" : "text-muted-foreground"),
            border: "border-transparent",
            bg: "bg-transparent",
        },
    };

    const styles = typeStyles[type];

    return (
        <div className="relative pl-8">
            <div className="absolute left-[2px] top-0 h-full w-px bg-border -translate-x-1/2"></div>
            <div className="absolute left-[2px] -top-3 h-3 w-px bg-border -translate-x-1/2"></div>
            
            <div className="relative">
                <div className="absolute -left-7 top-1 h-5 w-5 rounded-full bg-background border-2 border-border flex items-center justify-center">
                    <div className={cn("w-3 h-3 rounded-full", completed ? "bg-green-500" : "bg-muted-foreground")}></div>
                </div>

                <div className={cn("flex items-start gap-2 p-2 rounded-md border", styles.border, styles.bg)}>
                    <div className="mt-0.5">{styles.icon}</div>
                    <div className="flex-grow">
                        <p className={styles.text}>{label}</p>
                        {children && <div className="pt-2">{children}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};


export function DaoChart({ appData }: { appData: AppData }) {
    const { objective, shortTermGoal, weeklyTasks } = appData;

    const allTasks = Object.values(weeklyTasks).flat();

    const renderSubtasks = (subtasks: SubTask[]) => {
        if (subtasks.length === 0) return null;
        return (
            <div className="space-y-1 mt-2">
                {subtasks.map(subtask => (
                    <Node key={subtask.id} label={subtask.text} type="subtask" level={3} completed={subtask.completed} />
                ))}
            </div>
        );
    };

    return (
        <Card className="hover:bg-white/5 transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <GitMerge className="w-5 h-5 text-primary" />
                    Visualization of Your Dao
                </CardTitle>
                <CardDescription>A visual tree of your goals, schemes, and their current state.</CardDescription>
            </CardHeader>
            <CardContent>
                {(!objective && !shortTermGoal && allTasks.length === 0) ? (
                    <p className="text-muted-foreground text-center py-10">
                        Define your Grand Scheme and schemes to see your path unfold.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <Node label={objective || "Grand Scheme Undefined"} type="objective" level={0}>
                            <Node label={shortTermGoal || "Short-Term Goal Undefined"} type="goal" level={1}>
                                <div className="space-y-2">
                                {allTasks.length > 0 ? (
                                    allTasks.map(task => (
                                        <Node key={task.id} label={task.text} type="task" level={2} completed={task.completed}>
                                            {renderSubtasks(task.subtasks)}
                                        </Node>
                                    ))
                                ) : (
                                    <Node label="No schemes defined for this goal yet." type="task" level={2} completed={false} />
                                )}
                                </div>
                            </Node>
                        </Node>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

    