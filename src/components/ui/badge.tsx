"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "destructive"
  | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-light-blue)] text-[var(--color-dark-blue)] border border-[var(--color-light-blue)]/80",
  secondary:
    "bg-card/10 text-[var(--color-custume-light)] border border-border/60",
  outline:
    "bg-transparent text-[var(--color-custume-gray)] border border-border/80",
  success:
    "bg-emerald-500/12 text-emerald-300 border border-emerald-400/70",
  destructive:
    "bg-[var(--color-custume-red)]/12 text-[var(--color-custume-red)] border border-[var(--color-custume-red)]/70",
  warning:
    "bg-amber-500/12 text-amber-200 border border-amber-400/70",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          "rounded-full px-2.5 py-0.5",
          "text-[11px] font-semibold uppercase tracking-wide",
          "whitespace-nowrap",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
