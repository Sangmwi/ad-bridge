import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const SearchButton = React.forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className, isLoading = false, children = "검색", ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "relative inline-flex h-10 min-w-[84px] items-center justify-center rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-70 disabled:backdrop-blur-sm",
          isLoading ? "bg-primary" : "bg-primary hover:bg-primary/90",
          className
        )}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-2", isLoading && "opacity-40")}>
          <Search className="h-4 w-4" aria-hidden="true" />
          {children}
        </span>
        {isLoading && (
          <span
            className="absolute inset-0 m-auto h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-white"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);
SearchButton.displayName = "SearchButton";

