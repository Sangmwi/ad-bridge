import * as React from "react";
import { cn } from "@/lib/utils";

export type PanelHeaderProps = {
  title: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export function PanelHeader({ title, right, className }: PanelHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <h3 className="text-xl font-bold">{title}</h3>
      {right ? <div>{right}</div> : null}
    </div>
  );
}


