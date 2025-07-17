// components/dashboard/mind-palace-card.tsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateMindPalaceImageAction } from "@/app/actions";
import type { AppData } from "@/lib/types";

type MindPalaceCardProps = {
  appData: AppData;
  onUpdate: (mindPalace: AppData['mindPalace']) => void;
};

export function MindPalaceCard({ appData, onUpdate }: MindPalaceCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { mindPalace, objective, shortTermGoal, motivation, distractions, milestones } = appData;

  const handleGenerateImage = useCallback(async () => {
    setIsLoading(true);
    toast({ title: "Visualizing Your Inner World...", description: "The AI is peering into your mind palace." });

    try {
      const recentMilestones = milestones.slice(0, 5).map(m => m.title).join(', ');
      
      const result = await generateMindPalaceImageAction({
        objective,
        shortTermGoal,
        motivation,
        distractions,
        recentMilestones,
      });

      onUpdate({ imageUrl: result.imageUrl, lastGenerated: new Date().toISOString() });
      toast({ title: "✨ Mind Palace Visualized!", description: "A new snapshot of your inner world has been generated." });

    } catch (error) {
      console.error("Failed to generate mind palace image:", error);
      toast({ variant: "destructive", title: "Visualization Failed", description: "The connection to your inner world is unstable. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, [appData, onUpdate, toast]);

  return (
    <Card className="hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Mind Palace Visualization
        </CardTitle>
        <CardDescription>An AI-generated visual representation of your current cultivation state.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-lg bg-card border flex items-center justify-center relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center text-muted-foreground z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p>Generating...</p>
            </div>
          )}
          {mindPalace?.imageUrl && !isLoading ? (
            <Image
              src={mindPalace.imageUrl}
              alt="Mind Palace Visualization"
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-500"
              data-ai-hint="abstract space"
            />
          ) : !isLoading && (
            <div className="text-muted-foreground text-center p-4">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Your mind palace is yet to be visualized. Generate an image to see your inner world.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateImage} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {mindPalace?.imageUrl ? 'Refresh Visualization' : 'Generate Visualization'}
        </Button>
      </CardFooter>
    </Card>
  );
}
