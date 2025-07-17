// components/dashboard/history-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Star, Zap, Award, User, BookOpen } from "lucide-react";
import { format } from "date-fns";
import type { Milestone } from "@/lib/types";

type HistoryCardProps = {
  milestones: Milestone[];
};

const MILESTONE_ICONS = {
  RANK_UP: <Star className="w-4 h-4 text-yellow-400" />,
  TRIBULATION_COMPLETE: <Zap className="w-4 h-4 text-green-400" />,
  TRIBULATION_FAILED: <Zap className="w-4 h-4 text-red-400" />,
  REWARD_CLAIMED: <Award className="w-4 h-4 text-accent" />,
  NEMESIS_GENERATED: <User className="w-4 h-4 text-destructive" />,
  JOURNAL_ENTRY: <BookOpen className="w-4 h-4 text-blue-400" />,
};

export function HistoryCard({ milestones }: HistoryCardProps) {
  return (
    <Card className="hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-primary" />
          Historical Dao Records
        </CardTitle>
        <CardDescription>A chronicle of your key moments and achievements on the path of cultivation.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {milestones.length > 0 ? (
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
              {milestones.map((milestone) => (
                <div key={milestone.id} className="mb-8 relative">
                    <div className="absolute -left-[23px] top-1 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        {MILESTONE_ICONS[milestone.type]}
                    </div>
                    <p className="text-xs text-muted-foreground">{format(new Date(milestone.date), "MMMM d, yyyy 'at' h:mm a")}</p>
                    <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              Your history is yet to be written. Begin your journey to record your legend.
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
