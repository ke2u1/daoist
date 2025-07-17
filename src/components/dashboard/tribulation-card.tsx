"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Shield, RefreshCw } from "lucide-react";
import type { Tribulation } from "@/lib/types";

type TribulationCardProps = {
  tribulation: Tribulation;
  onOutcome: (outcome: 'completed' | 'failed') => void;
  onGenerateNew: () => void;
};

export function TribulationCard({ tribulation, onOutcome, onGenerateNew }: TribulationCardProps) {
    const isSettled = tribulation.completed || tribulation.failed;

    return (
        <Card className="border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <Zap className="w-5 h-5" />
                    Heavenly Tribulation
                </CardTitle>
                <CardDescription className="text-destructive/80">A trial from the heavens has descended!</CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="text-xl font-bold mb-2">{tribulation.title}</h3>
                <p className="text-foreground/90 mb-4">{tribulation.description}</p>
                <div className="flex justify-around items-center text-center">
                    <div>
                        <p className="text-sm text-green-500 font-semibold">REWARD</p>
                        <p className="text-2xl font-bold text-green-400">+{tribulation.reward} PE</p>
                    </div>
                    <div>
                        <p className="text-sm text-red-500 font-semibold">PENALTY</p>
                        <p className="text-2xl font-bold text-red-400">-{tribulation.penalty} PE</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {isSettled ? (
                    <div className="flex items-center gap-4 w-full">
                        <p className={`text-lg font-bold ${tribulation.completed ? 'text-green-500' : 'text-red-500'}`}>
                            {tribulation.completed ? "Tribulation Conquered!" : "Tribulation Failed"}
                        </p>
                        <Button onClick={onGenerateNew} variant="outline" size="sm" className="ml-auto">
                            <RefreshCw className="mr-2 h-4 w-4"/>
                            Seek New Tribulation
                        </Button>
                    </div>
                ) : (
                    <>
                        <Button variant="destructive" onClick={() => onOutcome('failed')}>
                            <Shield className="mr-2 h-4 w-4" />
                            Accept Failure
                        </Button>
                        <Button variant="default" onClick={() => onOutcome('completed')} className="bg-green-600 hover:bg-green-700 text-white">
                            <Zap className="mr-2 h-4 w-4" />
                            Claim Victory
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
