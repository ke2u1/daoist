
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown } from "lucide-react";
import { VENERABLES } from "@/lib/constants";
import { useState, useMemo } from "react";
import type { Nemesis } from "@/lib/types";

type LeaderboardCardProps = {
  userPoints: number;
  nemesis: Nemesis[];
};

export function LeaderboardCard({ userPoints, nemesis }: LeaderboardCardProps) {
  const [showAll, setShowAll] = useState(false);
  
  const allContestants = useMemo(() => {
    const rivals = nemesis.map(n => ({ name: n.name, points: n.points, isNemesis: true }));
    const contestants = [...VENERABLES, { name: "You", points: userPoints }, ...rivals];
    return contestants.sort((a, b) => b.points - a.points);
  }, [userPoints, nemesis]);
  
  const topContestantPoints = allContestants[0]?.points || 1;
  const userRankIndex = allContestants.findIndex(v => v.name === "You");

  const displayList = showAll ? allContestants : allContestants.slice(0, 5);

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
             const percentage = (person.points / topContestantPoints) * 100;
             const isUser = person.name === 'You';
             // @ts-ignore
             const isNemesis = person.isNemesis;
             const rank = allContestants.indexOf(person) + 1;
             
             let indicatorClass = '';
             if (isUser) indicatorClass = 'bg-primary';
             else if (isNemesis) indicatorClass = 'bg-destructive';
             else indicatorClass = 'bg-foreground';

             let textClass = '';
             if (isUser) textClass = 'text-primary';
             else if (isNemesis) textClass = 'text-destructive';


             return (
              <li key={person.name} className={isUser ? "p-2 -m-2 rounded-lg bg-primary/10 border border-primary/50" : isNemesis ? "p-2 -m-2 rounded-lg bg-destructive/10 border border-destructive/50" : ""}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-semibold ${textClass}`}>{rank}. {person.name}</span>
                  <span className={`text-sm font-semibold ${textClass}`}>{person.points.toLocaleString()} PE</span>
                </div>
                <Progress value={percentage} className="h-2" indicatorClassName={indicatorClass} />
              </li>
            );
          })}
          
          {!showAll && userRankIndex >= 5 && (
            <li className="pt-4 border-t border-dashed">
             <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-primary">{userRankIndex + 1}. You</span>
                <span className="text-sm font-bold text-primary">{userPoints.toLocaleString()} PE</span>
              </div>
              <Progress value={(userPoints / topContestantPoints) * 100} className="h-2" indicatorClassName="bg-primary"/>
          </li>
          )}

          {!showAll && allContestants.length > 5 && (
             <li className="text-center">
                <button onClick={() => setShowAll(true)} className="text-sm text-primary font-semibold hover:underline">
                    Show All
                </button>
             </li>
          )}
           {showAll && allContestants.length > 5 && (
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
