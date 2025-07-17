"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown } from "lucide-react";
import { VENERABLES } from "@/lib/constants";
import { useState, useMemo } from "react";

type LeaderboardCardProps = {
  userPoints: number;
};

export function LeaderboardCard({ userPoints }: LeaderboardCardProps) {
  const [showAll, setShowAll] = useState(false);
  
  const userWithVenerables = useMemo(() => {
    return [...VENERABLES, { name: "You", points: userPoints }]
      .sort((a, b) => b.points - a.points);
  }, [userPoints]);
  
  const topVenerablePoints = userWithVenerables[0]?.points || 1;
  const userRankIndex = userWithVenerables.findIndex(v => v.name === "You");

  const displayList = showAll ? userWithVenerables : userWithVenerables.slice(0, 5);

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
          {displayList.map((person, index) => {
             const percentage = (person.points / topVenerablePoints) * 100;
             const isUser = person.name === 'You';
             const rank = userWithVenerables.indexOf(person) + 1;
             return (
              <li key={person.name} className={isUser ? "p-2 -m-2 rounded-lg bg-primary/10 border border-primary/50" : ""}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-semibold ${isUser ? 'text-primary' : ''}`}>{rank}. {person.name}</span>
                  <span className={`text-sm ${isUser ? 'font-bold text-primary' : 'text-muted-foreground'}`}>{person.points.toLocaleString()} PE</span>
                </div>
                <Progress value={percentage} className="h-2" indicatorClassName={isUser ? 'bg-primary' : 'bg-foreground'} />
              </li>
            );
          })}
          
          {!showAll && userRankIndex >= 5 && (
            <li className="pt-4 border-t border-dashed">
             <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-primary">{userRankIndex + 1}. You</span>
                <span className="text-sm font-bold text-primary">{userPoints.toLocaleString()} PE</span>
              </div>
              <Progress value={(userPoints / topVenerablePoints) * 100} className="h-2" indicatorClassName="bg-primary"/>
          </li>
          )}

          {!showAll && userWithVenerables.length > 5 && (
             <li className="text-center">
                <button onClick={() => setShowAll(true)} className="text-sm text-primary font-semibold hover:underline">
                    Show All
                </button>
             </li>
          )}
           {showAll && userWithVenerables.length > 5 && (
             <li className="text-center">
                <button onClick={() => setShowAll(false)} className="text-sm text-primary font-semibold hover:underline">
                    Show Less
                </button>
             </li>
            )}
        </ul>
      </CardContent>
    </Card>
  );
}
