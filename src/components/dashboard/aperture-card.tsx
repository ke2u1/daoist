"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplet } from "lucide-react";
import type { Stats } from "@/lib/types";

type ApertureCardProps = {
  stats: Stats;
};

export function ApertureCard({ stats }: ApertureCardProps) {
  const { dailyEssenceCapacity, currentEssenceEarnedToday } = stats;
  const percentage = dailyEssenceCapacity > 0 ? (currentEssenceEarnedToday / dailyEssenceCapacity) * 100 : 0;

  return (
    <Card className="flex flex-col h-full hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplet className="w-5 h-5 text-primary" />
          Daily Aperture
        </CardTitle>
        <CardDescription>Your capacity to absorb Primeval Essence today.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-center items-center">
        <div className="w-full space-y-2 text-center">
            <div className="text-3xl font-bold text-primary">
                {currentEssenceEarnedToday}
                <span className="text-lg text-muted-foreground"> / {dailyEssenceCapacity} PE</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {percentage >= 100 ? "Your aperture is full for today." : "Absorb essence by completing schemes."}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
