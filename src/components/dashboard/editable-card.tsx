"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EditableCardProps = {
  id: string;
  title: string;
  content: string;
  placeholder: string;
  onUpdate: (id: string, newContent: string) => void;
  icon?: ReactNode;
  className?: string;
};

export function EditableCard({
  id,
  title,
  content,
  placeholder,
  onUpdate,
  icon,
  className,
}: EditableCardProps) {
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onUpdate(id, e.currentTarget.innerHTML);
  };

  return (
    <Card className={cn("flex flex-col bg-card/50 hover:bg-card transition-colors", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div
          id={id}
          className="editable h-full text-muted-foreground focus:text-foreground transition-colors rounded-md p-2 -m-2 outline-none focus:bg-white/5"
          contentEditable="true"
          spellCheck="false"
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: content }}
          onBlur={handleInput}
        />
      </CardContent>
    </Card>
  );
}
