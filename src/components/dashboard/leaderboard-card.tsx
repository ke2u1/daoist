"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown } from "lucide-react";
import { VENERABLES } from "@/lib/constants";

type LeaderboardCardProps = {
  userPoints: number;
};

export function LeaderboardCard({ userPoints }: LeaderboardCardProps) {
  const sortedVenerables = [...VENERABLES].sort((a, b) => b.points - a.points);
  const topVenerablePoints = sortedVenerables[0]?.points || 1;

  const userRank = [...sortedVenerables, { name: "You", points: userPoints }]
    .sort((a, b) => b.points - a.points)
    .findIndex(v => v.name === "You");

  return (
    <Card className="hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="w-5 h-5 text-primary" />
          Venerable Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedVenerables.map((venerable, index) => {
             const percentage = (venerable.points / topVenerablePoints) * 100;
             return (
              <li key={venerable.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{index + 1}. {venerable.name}</span>
                  <span className="text-sm text-muted-foreground">{venerable.points.toLocaleString()} PE</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </li>
            );
          })}

          <li className="pt-4 border-t border-dashed">
             <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-primary">{userRank + 1}. You</span>
                <span className="text-sm font-bold text-primary">{userPoints.toLocaleString()} PE</span>
              </div>
              <Progress value={(userPoints / topVenerablePoints) * 100} className="h-2" />
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
