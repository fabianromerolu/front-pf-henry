"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-dark-blue)] text-[var(--color-custume-light)]",
        className
      )}
      {...props}
    />
  );
}

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function AvatarImage({ className, onError, ...props }: AvatarImageProps) {
  return (
    <img
      className={cn(
        "absolute inset-0 h-full w-full object-cover",
        className
      )}
      onError={(e) => {
        // Si falla la imagen, la escondemos para que se vea el fallback
        e.currentTarget.style.display = "none";
        onError?.(e);
      }}
      {...props}
    />
  );
}

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AvatarFallback({
  className,
  ...props
}: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center bg-[var(--color-light-blue)] text-[var(--color-dark-blue)] text-xs font-semibold",
        className
      )}
      {...props}
    />
  );
}
