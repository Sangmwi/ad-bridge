"use client";

import { cn } from "@/lib/utils";

export function CategoryBadge({
  name,
  size = "sm",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20",
        size === "sm" ? "px-2.5 py-1 text-[11px] font-semibold" : "px-3 py-1.5 text-xs font-semibold",
        className
      )}
    >
      {name}
    </span>
  );
}

