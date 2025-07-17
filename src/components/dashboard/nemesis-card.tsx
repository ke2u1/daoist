
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, Edit, Trash2 } from "lucide-react";
import type { Nemesis } from "@/lib/types";

type NemesisCardProps = {
  nemesis: Nemesis;
  onEdit: () => void;
  onDelete: () => void;
};

export function NemesisCard({ nemesis, onEdit, onDelete }: NemesisCardProps) {
  if (!nemesis) return null;

  return (
    <Card className="border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-colors flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <Swords className="w-5 h-5" />
                    Fated Rival
                </CardTitle>
                <CardDescription className="text-destructive/80">
                    A shadow that pushes you to greatness.
                </CardDescription>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={onEdit}>
                    <Edit className="w-4 h-4" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
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
    </Card>
  );
}
