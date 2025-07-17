"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Swords, User, BarChart2, Wand2 } from "lucide-react";
import type { AppData, Nemesis } from "@/lib/types";
import { CustomizeNemesisDialog } from "./customize-nemesis-dialog";
import { Button } from "@/components/ui/button";

type NemesisCardProps = {
  appData: AppData;
  onUpdate: (nemesis: Nemesis) => void;
};

export function NemesisCard({ appData, onUpdate }: NemesisCardProps) {
  const { nemesis } = appData;
  if (!nemesis) return null;

  return (
    <Card className="border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Swords className="w-5 h-5" />
          Your Fated Rival
        </CardTitle>
        <CardDescription className="text-destructive/80">
          The shadow that pushes you to greatness.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <h3 className="text-2xl font-bold text-foreground">{nemesis.name}</h3>
            <p className="text-sm text-muted-foreground italic">"{nemesis.title}"</p>
        </div>
        <div className="text-sm space-y-1 text-foreground/90">
            <p>{nemesis.backstory}</p>
            <p className="font-semibold pt-2">Last Sighting: <span className="font-normal italic">{nemesis.lastAction}</span></p>
        </div>
        <div className="flex justify-around items-center text-center pt-2 border-t border-destructive/20">
            <div>
                <p className="text-sm text-red-500 font-semibold">RANK</p>
                <p className="text-lg font-bold text-red-400">{nemesis.rank}</p>
            </div>
            <div>
                <p className="text-sm text-red-500 font-semibold">ESSENCE</p>
                <p className="text-lg font-bold text-red-400">{nemesis.points.toLocaleString()} PE</p>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <CustomizeNemesisDialog appData={appData} onUpdate={onUpdate}>
            <Button variant="outline" className="ml-auto">
                <Wand2 className="mr-2 h-4 w-4" />
                Edit Rival
            </Button>
        </CustomizeNemesisDialog>
      </CardFooter>
    </Card>
  );
}
