"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type WasteEssenceDialogProps = {
  children: React.ReactNode;
  onConfirm: (amount: number, reason: string) => void;
};

export function WasteEssenceDialog({ children, onConfirm }: WasteEssenceDialogProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleConfirm = () => {
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a positive number for the essence amount.",
      });
      return;
    }
    onConfirm(numAmount, reason.trim() || "unspecified transgression");
    setAmount("");
    setReason("");
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Waste Primeval Essence?</AlertDialogTitle>
          <AlertDialogDescription>
            Deduct essence for transgressions against your Dao. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="waste-amount">Amount</Label>
            <Input
              id="waste-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 10"
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waste-reason">Reason</Label>
            <Input
              id="waste-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., procrastination"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirm Deduction
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
