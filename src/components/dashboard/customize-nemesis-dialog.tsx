// components/dashboard/customize-nemesis-dialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { customizeNemesisAction } from "@/app/actions";
import type { AppData, Nemesis } from "@/lib/types";

type CustomizeNemesisDialogProps = {
  children: React.ReactNode;
  appData: AppData;
  onUpdate: (nemesis: Nemesis) => void;
};

const formSchema = z.object({
    prompt: z.string().min(10, "Please describe your rival in more detail (at least 10 characters)."),
});

export function CustomizeNemesisDialog({ children, appData, onUpdate }: CustomizeNemesisDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    toast({ title: "Summoning Your Rival...", description: "The AI is forging your nemesis based on your design." });
    try {
      const result = await customizeNemesisAction({
        prompt: values.prompt,
        userRank: appData.stats.rank,
        objective: appData.objective,
      });
      onUpdate(result);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Rival Manifested!",
        description: "Your custom rival has entered the world.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not create your rival. Please try again later.",
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
            <Wand2 className="w-5 h-5 text-primary" />
            Customize Your Rival
          </DialogTitle>
          <DialogDescription>
            Describe your ideal rival. The AI will bring them to life. Be descriptive! Try mentioning their name, field, or personality.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6 py-4">
                <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rival Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., 'My rival is a brilliant programmer named Sarah who is building a competing app. She is ruthless and just poached a key engineer.'" 
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Create Rival
                </Button>
              </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
