"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, Star, BrainCircuit, Info, ChevronDown, ChevronRight, PlusCircle, Calendar, Sparkles } from "lucide-react";
import { RefineBenefitsDialog } from "./refine-benefits-dialog";
import { AISchemeGeneratorDialog } from "./ai-scheme-generator-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";
import { AppData, Task, WeeklyTasks } from "@/lib/types";
import { DAYS_OF_WEEK, DIFFICULTY_POINTS } from "@/lib/constants";

type SchemeCardProps = {
  appData: AppData;
  onTaskAction: (action: string, payload: any) => void;
  filteredTasks: WeeklyTasks;
};

const taskSchema = z.object({
  text: z.string().min(1, "Task description is required."),
  benefits: z.string().optional(),
  difficulty: z.string(),
  customPoints: z.coerce.number().min(1, "Custom points must be at least 1."),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function SchemeCard({ appData, onTaskAction, filteredTasks }: SchemeCardProps) {
  const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[0].toLowerCase());

  useEffect(() => {
    const todayIndex = (new Date().getDay() + 6) % 7;
    const todayKey = DAYS_OF_WEEK[todayIndex].toLowerCase();
    const savedDay = localStorage.getItem("activeDay");
    setActiveDay(savedDay && DAYS_OF_WEEK.map(d => d.toLowerCase()).includes(savedDay) ? savedDay : todayKey);
  }, []);

  const handleTabChange = (day: string) => {
    setActiveDay(day);
    localStorage.setItem("activeDay", day);
  };

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      text: "",
      benefits: "",
      difficulty: "medium",
      customPoints: DIFFICULTY_POINTS["medium"],
    },
  });

  const selectedDifficulty = form.watch("difficulty");

  useEffect(() => {
    form.setValue("customPoints", DIFFICULTY_POINTS[selectedDifficulty] || 5);
  }, [selectedDifficulty, form]);

  const onSubmit = (data: TaskFormData) => {
    const newTask: Omit<Task, 'id' | 'completed' | 'subtasks'> = {
      text: data.text,
      benefits: data.benefits || "",
      difficulty: data.difficulty as Task['difficulty'],
      actualPoints: data.customPoints,
    };
    onTaskAction('add', { 
        day: activeDay, 
        task: { ...newTask, id: Date.now(), completed: false, subtasks: [] } 
    });
    form.reset();
  };
  
  const handleAddMultipleTasks = (tasks: Omit<Task, 'id' | 'completed' | 'subtasks'>[]) => {
    const newTasks = tasks.map(task => ({
        ...task,
        id: Date.now() + Math.random(),
        completed: false,
        subtasks: [],
    }));
    onTaskAction('addMultiple', { day: activeDay, tasks: newTasks });
  }

  return (
    <Card className="hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Seven Day Scheme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeDay} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7">
            {DAYS_OF_WEEK.map(day => (
              <TabsTrigger key={day} value={day.toLowerCase()}>{day.substring(0, 3)}</TabsTrigger>
            ))}
          </TabsList>
          {DAYS_OF_WEEK.map(day => {
            const dayKey = day.toLowerCase();
            const tasksForDay = filteredTasks[dayKey];
            return (
              <TabsContent key={dayKey} value={dayKey}>
                <ScrollArea className="h-[300px] pr-4 mt-4">
                  <div className="space-y-2">
                    {tasksForDay?.length > 0 ? (
                      tasksForDay.map(task => (
                        <TaskItem key={task.id} task={task} appData={appData} onTaskAction={onTaskAction} />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-10">No schemes for {day}.</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            );
          })}
        </Tabs>
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Add New Scheme</h3>
             <AISchemeGeneratorDialog appData={appData} onGenerate={handleAddMultipleTasks}>
              <Button variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </AISchemeGeneratorDialog>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheme / Task</FormLabel>
                    <FormControl>
                      <Input placeholder="Input a new scheme or task..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detail the benefits (e.g., gain resources, increase cultivation...)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Mortal (1 PE)</SelectItem>
                          <SelectItem value="medium">Profound (5 PE)</SelectItem>
                          <SelectItem value="hard">Heavenly (10 PE)</SelectItem>
                          <SelectItem value="scene">Immortal Scene (50 PE)</SelectItem>
                          <SelectItem value="venerable-scene">Venerable Scene (100 PE)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom PE</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Scheme
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskItem({ task, appData, onTaskAction }: { task: Task, appData: AppData, onTaskAction: (action: string, payload: any) => void }) {
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState('');

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if(subtaskInput.trim()){
      onTaskAction('addSubtask', { taskId: task.id, subtaskText: subtaskInput });
      setSubtaskInput('');
    }
  }

  const updateTaskBenefits = (newBenefits: string) => {
    onTaskAction('update', { task: { ...task, benefits: newBenefits }});
  }

  return (
    <Collapsible className="group p-3 rounded-lg border bg-card/80 transition-colors hover:bg-accent/10 hover:border-accent/50">
      <div className="flex items-center gap-3">
        <div
          className={cn("w-5 h-5 rounded-full border-2 cursor-pointer flex-shrink-0 flex items-center justify-center transition-colors", task.completed ? 'bg-accent border-accent' : 'border-muted-foreground group-hover:border-primary')}
          onClick={() => onTaskAction('toggle', { taskId: task.id })}
        >
          {task.completed && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <CollapsibleTrigger className="flex-grow text-left">
          <span className={cn(task.completed && 'line-through text-muted-foreground')}>{task.text}</span>
        </CollapsibleTrigger>
        <div className="flex items-center gap-1 ml-auto">
           <RefineBenefitsDialog appData={appData} task={task} onUpdateBenefits={updateTaskBenefits}>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-70 group-hover:opacity-100" title="Refine Benefits with AI"><BrainCircuit className="w-4 h-4 text-primary" /></Button>
           </RefineBenefitsDialog>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-70 group-hover:opacity-100" title="Add to Focus" onClick={() => onTaskAction('focus', { taskId: task.id })}><Star className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive opacity-70 group-hover:opacity-100" title="Delete Task" onClick={() => onTaskAction('delete', { taskId: task.id })}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>
      <CollapsibleContent className="pl-8 pt-3 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">{task.actualPoints} PE</span>
            <span>|</span>
            <span className="capitalize">{task.difficulty}</span>
        </div>
        
        {task.benefits && (
            <button onClick={() => setIsBenefitsOpen(!isBenefitsOpen)} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <Info className="w-4 h-4" />
                Benefits
                {isBenefitsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
        )}
        {isBenefitsOpen && <p className="text-sm text-muted-foreground border-l-2 border-accent pl-4 py-1 whitespace-pre-wrap">{task.benefits}</p>}
        
        <div className="space-y-2">
            {task.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-3">
                    <div
                      className={cn("w-4 h-4 rounded-full border-2 cursor-pointer flex-shrink-0 flex items-center justify-center transition-colors", subtask.completed ? 'bg-accent/80 border-accent/80' : 'border-muted-foreground/50 hover:border-primary')}
                      onClick={() => onTaskAction('toggle', { taskId: subtask.id })}
                    >
                      {subtask.completed && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={cn("text-sm", subtask.completed && 'line-through text-muted-foreground/80')}>{subtask.text}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-destructive/50 hover:text-destructive" title="Delete Subtask" onClick={() => onTaskAction('delete', { taskId: subtask.id })}>
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            ))}
        </div>
        
        <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
            <Input 
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Add sub-task..."
              className="h-8 text-sm"
              spellCheck="false"
            />
            <Button type="submit" size="sm" variant="ghost"><PlusCircle className="w-4 h-4 mr-1"/> Add</Button>
        </form>

      </CollapsibleContent>
    </Collapsible>
  );
}
