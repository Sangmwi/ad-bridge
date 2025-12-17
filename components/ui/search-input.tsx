import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, iconClassName, ...props }, ref) => {
    return (
      <div className="relative flex-1">
        <Search
          strokeWidth={2.5}
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary",
            iconClassName
          )}
        />
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

