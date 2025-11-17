// src/components/ui/badge.tsx
"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "destructive"
  | "warning";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-light-blue text-dark-blue border border-light-blue/80",
  secondary:
    "bg-white/10 text-custume-light border border-white/20",
  outline:
    "bg-transparent text-custume-light border border-white/40",
  success:
    "bg-emerald-500/15 text-emerald-300 border border-emerald-400/70",
  destructive:
    "bg-red-500/15 text-red-300 border border-red-400/70",
  warning:
    "bg-amber-500/15 text-amber-200 border border-amber-400/70",
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
