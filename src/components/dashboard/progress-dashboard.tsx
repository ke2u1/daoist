"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WasteEssenceDialog } from "@/components/dashboard/waste-essence-dialog";
import { Flame, Star, Zap, BarChart, Shield, Trophy } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Stats } from "@/lib/types";
import { useMemo } from "react";
import { format, subDays } from 'date-fns';

type ProgressDashboardProps = {
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
  <div className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-card/80 transition-colors">
    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
      {icon} {label}
    </div>
    <div className={`text-xl md:text-2xl font-bold ${className}`}>{value}</div>
  </div>
);

export function ProgressDashboard({ stats, onWasteEssence }: ProgressDashboardProps) {

  const chartData = useMemo(() => {
    const data = [];
    const endDate = new Date();
    const dailyProgress = stats.dailyProgress || [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(endDate, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayData = dailyProgress.find(d => d.date === dateString);
      data.push({
        date: format(date, 'MMM d'),
        points: dayData ? dayData.points : 0,
      });
    }
    return data;
  }, [stats.dailyProgress]);

  return (
    <Card className="flex flex-col hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-primary" />
          Progress Dashboard
        </CardTitle>
        <CardDescription>Your cultivation base and recent progress.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between">
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Primeval Essence Earned (Last 7 Days)</h4>
            <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                            }}
                        />
                        <Area type="monotone" dataKey="points" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <StatItem
            label="Total Essence"
            value={stats.totalPoints}
            icon={<Zap className="w-4 h-4" />}
            className="text-primary"
          />
          <StatItem
            label="Rank"
            value={stats.rank}
            icon={<Star className="w-4 h-4" />}
            className="text-primary"
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
            label="Schemes Done"
            value={stats.allTimeTasksCompleted}
            icon={<BarChart className="w-4 h-4" />}
          />
           <StatItem
            label="Rewards Claimed"
            value={stats.rewardsClaimed}
            icon={<Trophy className="w-4 h-4" />}
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
