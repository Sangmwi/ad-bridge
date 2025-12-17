import * as React from "react";
import { cn } from "@/lib/utils";

export function CountBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold",
        className,
      )}
    >
      {count.toLocaleString()}건
    </span>
  );
}


