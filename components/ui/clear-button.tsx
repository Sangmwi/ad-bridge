import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const ClearButton = React.forwardRef<HTMLButtonElement, ClearButtonProps>(
  ({ className, children = "초기화", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md px-3 text-sm text-neutral-700 hover:bg-white/90",
          className
        )}
        {...props}
      >
        <X className="h-4 w-4" />
        {children}
      </button>
    );
  }
);
ClearButton.displayName = "ClearButton";

