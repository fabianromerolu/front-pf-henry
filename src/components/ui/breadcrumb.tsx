"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm text-white/80", className)}
      {...props}
    />
  );
}

export interface BreadcrumbListProps
  extends React.OlHTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1 text-xs text-[var(--color-custume-light)]/75",
        className
      )}
      {...props}
    />
  );
}

export interface BreadcrumbItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-1 min-w-0 text-ellipsis",
        className
      )}
      {...props}
    />
  );
}

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Si no viene href, se renderiza como span */
  href?: string;
}

export function BreadcrumbLink({
  className,
  href,
  children,
  ...props
}: BreadcrumbLinkProps) {
  if (!href) {
    return (
      <span
        className={cn(
          "truncate text-[var(--color-custume-light)]/80",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "truncate text-[var(--color-light-blue)] hover:underline underline-offset-4",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbSeparator({
  className,
  children,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span
      className={cn("px-1 text-[var(--color-custume-light)]/60", className)}
      aria-hidden="true"
      {...props}
    >
      {children ?? "/"}
    </span>
  );
}
