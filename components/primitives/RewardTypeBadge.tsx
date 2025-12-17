"use client";

import { cn } from "@/lib/utils";
import { formatWon } from "@/lib/format";

export function RewardTypeBadge({
  rewardType,
  amount,
  size = "sm",
  className,
}: {
  rewardType: string;
  amount: number | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const label = rewardType === "cps" ? "판매당" : "클릭당";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/70 text-neutral-800 shadow-sm backdrop-blur-md",
        size === "sm" ? "px-2.5 py-1 text-[11px] font-semibold" : "px-3 py-1.5 text-xs font-semibold",
        className
      )}
    >
      <span className="text-neutral-600">{label}</span>
      <span className="text-neutral-900">{amount == null ? "????원" : formatWon(amount)}</span>
    </span>
  );
}


