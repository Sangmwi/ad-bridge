import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] active:bg-[var(--primary-dark)]",
      outline:
        "border border-[var(--border)] bg-transparent hover:bg-[var(--neutral-50)] text-[var(--foreground)]",
      ghost: "hover:bg-[var(--neutral-50)] text-[var(--foreground)]",
      secondary:
        "bg-[var(--neutral-100)] text-[var(--foreground)] hover:bg-[var(--neutral-200)]",
    };

    const sizes = {
      default: "px-6 py-2.5 text-sm",
      sm: "px-4 py-2 text-sm",
      lg: "px-8 py-3 text-base",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
