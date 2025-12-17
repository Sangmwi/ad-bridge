import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ActionCardLinkProps = {
  href: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function ActionCardLink({
  href,
  title,
  description,
  icon,
  className,
}: ActionCardLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-md transition-all text-left h-full bg-white block",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
          {title}
        </h3>
        {icon ? (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
            <div className="text-primary group-hover:text-white transition-colors">
              {icon}
            </div>
          </div>
        ) : null}
      </div>
      {description ? (
        <p className="text-neutral-600">
          {description}
        </p>
      ) : null}
    </Link>
  );
}


