import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeTone =
  | "success"
  | "neutral"
  | "danger"
  | "info";

export type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
  size?: "sm" | "md";
  className?: string;
};

export function StatusBadge({
  children,
  tone = "neutral",
  size = "sm",
  className,
}: StatusBadgeProps) {
  const tones: Record<StatusBadgeTone, string> = {
    success: "bg-success/10 text-success",
    neutral: "bg-neutral-100 text-neutral-600",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  const sizes = {
    sm: "px-2 py-1 rounded-md text-xs font-semibold",
    md: "px-3 py-1 rounded-full text-xs font-bold",
  };

  return (
    <span className={cn(sizes[size], tones[tone], className)}>
      {children}
    </span>
  );
}


