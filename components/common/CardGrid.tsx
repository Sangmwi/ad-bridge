import * as React from "react";
import { cn } from "@/lib/utils";

export type CardGridProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "campaigns" | "dashboard";
};

export function CardGrid({ children, className, variant = "campaigns" }: CardGridProps) {
  const variants = {
    campaigns: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    dashboard: "grid md:grid-cols-3 gap-6",
  } as const;

  return <div className={cn(variants[variant], className)}>{children}</div>;
}


