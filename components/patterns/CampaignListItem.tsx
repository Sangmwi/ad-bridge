import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/primitives/StatusBadge";

export type CampaignListItemProps = {
  href: string;
  title: string;
  status: "active" | "inactive";
  leftLabel: string;
  leftValue: React.ReactNode;
  rightLabel: string;
  rightValue: React.ReactNode;
  className?: string;
};

export function CampaignListItem({
  href,
  title,
  status,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  className,
}: CampaignListItemProps) {
  const isActive = status === "active";

  return (
    <Link
      href={href}
      className={cn(
        "block p-5 rounded-lg border border-border hover:border-primary hover:bg-neutral-50 transition-all group",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
          {title}
        </h3>
        <StatusBadge tone={isActive ? "success" : "neutral"} size="sm">
          {isActive ? "진행중" : "중지됨"}
        </StatusBadge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-neutral-600">{leftLabel}</p>
          <p className="font-semibold text-neutral-900">{leftValue}</p>
        </div>
        <div className="text-right">
          <p className="text-neutral-600">{rightLabel}</p>
          <p className="font-semibold text-primary">{rightValue}</p>
        </div>
      </div>
    </Link>
  );
}


