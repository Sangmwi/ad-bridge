import * as React from "react";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
};

export function EmptyState({
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const padding = size === "lg" ? "py-32" : "py-20";

  return (
    <div
      className={cn(
        "text-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50",
        padding,
        className,
      )}
    >
      <div className="mx-auto max-w-md px-6">
        <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
        {description ? (
          <p className="mt-2 text-neutral-600">{description}</p>
        ) : null}
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}


