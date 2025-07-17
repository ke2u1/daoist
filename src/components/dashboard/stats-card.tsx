"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WasteEssenceDialog } from "@/components/dashboard/waste-essence-dialog";
import { Flame, Star, Zap, BarChart, Shield } from "lucide-react";
import type { Stats } from "@/lib/types";

type StatsCardProps = {
  stats: Stats;
  onWasteEssence: (amount: number, reason: string) => void;
};

const StatItem = ({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
      {icon} {label}
    </div>
    <div className={`text-3xl font-bold ${className}`}>{value}</div>
  </div>
);

export function StatsCard({ stats, onWasteEssence }: StatsCardProps) {
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long' });
  const todayKey = today.toLowerCase();
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-primary" />
          Cultivation Base
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
          <StatItem
            label="Primeval Essence"
            value={stats.totalPoints}
            icon={<Zap className="w-4 h-4" />}
            className="text-primary"
          />
          <StatItem
            label="Rank"
            value={stats.rank}
            icon={<Star className="w-4 h-4" />}
            className="text-primary text-2xl"
          />
          <StatItem
            label="Streak"
            value={stats.streak}
            icon={<Flame className="w-4 h-4" />}
            className="text-amber-400"
          />
           <StatItem
            label="Tasks Started"
            value={stats.tasksStarted}
            icon={<BarChart className="w-4 h-4" />}
          />
          <StatItem
            label="All-Time Schemes"
            value={stats.allTimeTasksCompleted}
            icon={<BarChart className="w-4 h-4" />}
          />
        </div>
        <div>
          <WasteEssenceDialog onConfirm={onWasteEssence}>
            <Button variant="destructive" className="w-full">
              Waste Essence
            </Button>
          </WasteEssenceDialog>
        </div>
      </CardContent>
    </Card>
  );
}
