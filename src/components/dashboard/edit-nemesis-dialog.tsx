
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { customizeNemesisAction } from "@/app/actions";
import type { AppData, Nemesis } from "@/lib/types";

type EditNemesisDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nemesis: Nemesis;
  appData: AppData;
  onUpdate: (nemesis: Nemesis) => void;
};

const formSchema = z.object({
    prompt: z.string().min(10, "Please describe your desired changes in more detail (at least 10 characters)."),
});

export function EditNemesisDialog({ isOpen, onOpenChange, nemesis, appData, onUpdate }: EditNemesisDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  useEffect(() => {
    // Reset form when dialog is opened or nemesis changes
    form.reset({ prompt: "" });
  }, [isOpen, nemesis, form]);


  const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    toast({ title: "Reshaping Your Rival...", description: "The AI is forging your nemesis based on your design." });
    try {
      const result = await customizeNemesisAction({
        prompt: values.prompt,
        userRank: appData.stats.rank,
        objective: appData.objective,
        existingNemesis: nemesis,
      });
      onUpdate(result);
      onOpenChange(false);
      toast({
        title: "Rival Updated!",
        description: `${nemesis.name} has been reshaped by your will.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not update your rival. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Edit Rival: {nemesis.name}
          </DialogTitle>
          <DialogDescription>
            Describe how you want to change your rival. The AI will bring your vision to life. Be descriptive! You can change their name, title, or even their backstory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6 py-4">
                <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={`e.g., "Change their name to 'Dr. Evelyn Reed'. They just published a groundbreaking paper in my field."`}
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Update Rival
                </Button>
              </div>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
