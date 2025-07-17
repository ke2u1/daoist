"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { refineTaskBenefitsAction } from "@/app/actions";
import type { AppData, Task } from "@/lib/types";

type RefineBenefitsDialogProps = {
  children: React.ReactNode;
  appData: AppData;
  task: Task;
  onUpdateBenefits: (newBenefits: string) => void;
};

export function RefineBenefitsDialog({ children, appData, task, onUpdateBenefits }: RefineBenefitsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refinedBenefits, setRefinedBenefits] = useState("");
  const { toast } = useToast();

  const handleRefine = async () => {
    setIsLoading(true);
    setRefinedBenefits("");
    try {
      const result = await refineTaskBenefitsAction({
        objective: appData.objective,
        shortTermGoal: appData.shortTermGoal,
        motivation: appData.motivation,
        distractions: appData.distractions,
        task: task.text,
        benefits: task.benefits,
      });
      setRefinedBenefits(result.refinedBenefits);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Refinement Failed",
        description: "Could not connect to the AI. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onUpdateBenefits(refinedBenefits);
    setIsOpen(false);
    toast({
        title: "Benefits Updated",
        description: "The refined benefits have been applied to your task.",
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Refine Task Benefits
          </DialogTitle>
          <DialogDescription>
            Use AI to align this task's benefits with your grand scheme.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Current Benefits</h4>
            <Textarea readOnly value={task.benefits || "No benefits defined."} className="h-48 font-code" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Refined Benefits</h4>
            <div className="relative">
                <Textarea value={refinedBenefits} onChange={(e) => setRefinedBenefits(e.target.value)} className="h-48 font-code" />
                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleRefine} disabled={isLoading}>
            <Zap className="mr-2 h-4 w-4" />
            Refine with AI
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleApply} disabled={!refinedBenefits}>
            Apply Refined Benefits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
