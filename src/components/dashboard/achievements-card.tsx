"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { ACHIEVEMENTS_CONFIG } from "@/lib/constants";

type AchievementsCardProps = {
  achievements: { [key: string]: boolean };
};

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  const achievementList = Object.keys(ACHIEVEMENTS_CONFIG);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5 text-primary" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementList.map(key => {
            const config = ACHIEVEMENTS_CONFIG[key];
            const isUnlocked = achievements[key];
            return (
              <div
                key={key}
                className={`p-4 rounded-lg border transition-all ${isUnlocked ? 'border-accent/80 bg-accent/10' : 'border-border bg-card'}`}
              >
                <h4 className="font-semibold flex items-center justify-between">
                  {config.name}
                  {isUnlocked && <span className="text-lg">🏆</span>}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
