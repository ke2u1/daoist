
"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cog, FileDown, FileUp, RotateCcw, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AppData, Nemesis } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CustomizeNemesisDialog } from "./customize-nemesis-dialog";
import { useAuth } from "@/hooks/use-auth";

type SettingsCardProps = {
  appData: AppData;
  onImport: (data: AppData) => void;
  onReset: () => void;
  onAddRival: (nemesis: Nemesis) => void;
};

export function SettingsCard({ appData, onImport, onReset, onAddRival }: SettingsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isResetAlertOpen, setIsResetAlertOpen] = useState(false);
  const { user } = useAuth();

  const handleExport = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Login Required", description: "You must be logged in to export your personal data." });
      return;
    }
    try {
      const dataStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `essence-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Export Successful", description: "Your data has been saved." });
    } catch (error) {
      toast({ variant: "destructive", title: "Export Failed", description: "Could not export your data." });
    }
  };

  const handleImportClick = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Login Required", description: "You must be logged in to import data." });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") throw new Error("File is not valid text.");
        const importedData = JSON.parse(text);
        
        if (window.confirm("This will overwrite all current data. Are you sure?")) {
          onImport(importedData);
          toast({ title: "Import Successful", description: "Your data has been loaded." });
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Import Failed", description: "The selected file is corrupted or invalid." });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleResetClick = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Login Required", description: "Please log in to reset your personal progress." });
      return;
    }
    setIsResetAlertOpen(true);
  }

  return (
    <Card className="hover:bg-card/95 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cog className="w-5 h-5 text-primary" />
          Settings & Data
        </CardTitle>
        <CardDescription>
          Backup your progress, add new rivals, or start a new path.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button onClick={handleExport} className="w-full">
          <FileDown className="mr-2 h-4 w-4" /> Export Data
        </Button>
        <Button onClick={handleImportClick} variant="secondary" className="w-full">
          <FileUp className="mr-2 h-4 w-4" /> Import Data
        </Button>

        <CustomizeNemesisDialog appData={appData} onAdd={onAddRival}>
          <Button variant="outline" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" /> Add New Rival
          </Button>
        </CustomizeNemesisDialog>

        <AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button onClick={handleResetClick} variant="destructive" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. All of your cultivation progress, schemes, and essence will be permanently erased. A new journey will begin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>
                Yes, erase my legend
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
      </CardContent>
    </Card>
  );
}

    