"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSchemesAction } from "@/app/actions";
import type { AppData, Task } from "@/lib/types";

type AISchemeGeneratorDialogProps = {
  children: React.ReactNode;
  appData: AppData;
  onGenerate: (tasks: Omit<Task, 'id' | 'completed' | 'subtasks'>[]) => void;
};

const formSchema = z.object({
    goal: z.string().min(5, "Please describe your goal in more detail."),
});

export function AISchemeGeneratorDialog({ children, appData, onGenerate }: AISchemeGeneratorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "",
    },
  });

  const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await generateSchemesAction({
        goal: values.goal,
        objective: appData.objective,
        shortTermGoal: appData.shortTermGoal,
      });
      onGenerate(result.schemes);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Schemes Generated",
        description: "The AI has forged new schemes for your consideration.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate schemes. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Scheme Generator
          </DialogTitle>
          <DialogDescription>
            Describe a goal, and the AI will forge a set of schemes to help you achieve it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6 py-4">
                <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Breakthrough to the next cultivation realm'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Schemes
                </Button>
              </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
