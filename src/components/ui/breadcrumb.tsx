"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type BreadcrumbProps = React.HTMLAttributes<HTMLElement>;

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "flex items-center text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export type BreadcrumbListProps = React.OlHTMLAttributes<HTMLOListElement>;

export function BreadcrumbList({
  className,
  ...props
}: BreadcrumbListProps) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1 text-xs",
        "text-[var(--color-custume-gray)]/85",
        className
      )}
      {...props}
    />
  );
}

export type BreadcrumbItemProps = React.LiHTMLAttributes<HTMLLIElement>;

export function BreadcrumbItem({
  className,
  ...props
}: BreadcrumbItemProps) {
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
          "truncate text-[var(--color-custume-gray)]/90",
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
        "truncate",
        "text-[var(--color-light-blue)] hover:text-[var(--color-light-blue)]/90",
        "hover:underline underline-offset-4",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export type BreadcrumbSeparatorProps =
  React.HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbSeparator({
  className,
  children,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span
      className={cn(
        "px-1 text-[var(--color-custume-gray)]/70",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children ?? "/"}
    </span>
  );
}
