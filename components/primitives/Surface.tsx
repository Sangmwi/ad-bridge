import * as React from "react";
import { cn } from "@/lib/utils";

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "card" | "panel";
};

export function Surface({ className, variant = "card", ...props }: SurfaceProps) {
  const variants = {
    card: "bg-white rounded-xl border border-border",
    panel: "bg-white rounded-xl border border-border",
  } as const;

  return <div className={cn(variants[variant], className)} {...props} />;
}


