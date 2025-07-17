"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cog, FileDown, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AppData } from "@/lib/types";

type SettingsCardProps = {
  appData: AppData;
  onImport: (data: AppData) => void;
};

export function SettingsCard({ appData, onImport }: SettingsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
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
        // Add validation here if needed
        if (window.confirm("This will overwrite all current data. Are you sure?")) {
          onImport(importedData);
          toast({ title: "Import Successful", description: "Your data has been loaded." });
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Import Failed", description: "The selected file is corrupted or invalid." });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cog className="w-5 h-5 text-primary" />
          Settings & Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Backup your cultivation progress or transfer it to another vessel.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExport} className="w-full">
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={handleImportClick} variant="secondary" className="w-full">
            <FileUp className="mr-2 h-4 w-4" /> Import Data
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
