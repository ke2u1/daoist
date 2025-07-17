"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookText, BrainCircuit, PlusCircle, Loader2, Sparkles } from "lucide-react";
import type { JournalEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { analyzeJournalEntryAction } from '@/app/actions';
import { format } from 'date-fns';

type JournalCardProps = {
  entries: JournalEntry[];
  onUpdate: (entry: JournalEntry, analysis?: JournalEntry['analysis']) => void;
};

export function JournalCard({ entries, onUpdate }: JournalCardProps) {
  const [newEntry, setNewEntry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;

    setIsSaving(true);
    toast({ title: "Saving Journal Entry...", description: "Your thoughts are being recorded." });

    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: newEntry,
    };

    try {
      const analysis = await analyzeJournalEntryAction({ entry: newEntry });
      onUpdate(entry, analysis);
      toast({ title: "✨ Entry Analyzed!", description: "AI has provided insights on your entry." });
    } catch (error) {
      console.error("Failed to analyze journal entry:", error);
      onUpdate(entry); // Save without analysis
      toast({ variant: "destructive", title: "Entry Saved, Analysis Failed", description: "Your entry was saved, but the AI could not provide insights." });
    } finally {
      setNewEntry("");
      setIsSaving(false);
    }
  };

  return (
    <Card className="hover:bg-white/5 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookText className="w-5 h-5 text-primary" />
          Cultivator's Journal
        </CardTitle>
        <CardDescription>Record your thoughts, tribulations, and moments of enlightenment. AI will help you find the patterns.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your mind? What insights have you gained today?"
            className="min-h-[120px]"
            disabled={isSaving}
          />
          <Button onClick={handleAddEntry} disabled={isSaving || !newEntry.trim()} className="w-full">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            Add New Entry
          </Button>
        </div>

        <div className="mt-6">
            <h3 className="font-semibold mb-2">Past Entries</h3>
            {entries.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {entries.map(entry => (
                        <AccordionItem key={entry.id} value={`item-${entry.id}`}>
                            <AccordionTrigger>
                                {format(new Date(entry.date), "MMMM d, yyyy - h:mm a")}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                                {entry.analysis && (
                                    <div className="p-3 rounded-md bg-primary/10 border border-primary/20 space-y-2">
                                        <h4 className="font-semibold text-primary flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4"/>AI Insights</h4>
                                        <p className="text-sm"><strong>Sentiment:</strong> <span className="capitalize">{entry.analysis.sentiment}</span></p>
                                        {entry.analysis.themes && entry.analysis.themes.length > 0 && (
                                            <div>
                                                <p className="text-sm"><strong>Key Themes:</strong></p>
                                                <ul className="list-disc list-inside text-sm">
                                                    {entry.analysis.themes.map((theme, i) => <li key={i}>{theme}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <p className="text-muted-foreground text-center py-6">Your journal is empty. Begin by writing your first entry.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
