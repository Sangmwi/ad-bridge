import * as React from "react";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/primitives/Surface";

export type StatCardProps = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
};

export function StatCard({ icon, label, value, badge, className }: StatCardProps) {
  return (
    <Surface className={cn("p-6 hover:border-primary hover:shadow-md transition-all", className)}>
      <div className="flex items-center justify-between mb-4">
        {icon ? (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        ) : (
          <div />
        )}
        {badge ? <div className="text-xs font-semibold">{badge}</div> : null}
      </div>
      <p className="text-sm text-neutral-600 mb-1">{label}</p>
      <div className="text-3xl font-bold">{value}</div>
    </Surface>
  );
}


