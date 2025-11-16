import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const sizeClasses = {
  sm: "text-sm px-6 py-2.5 min-w-[160px]",
  md: "text-base px-8 py-3 min-w-[200px]",
  lg: "text-lg px-10 py-3.5 min-w-[240px]",
  xl: "text-xl px-12 py-4 min-w-[280px]",
};

function LightButton({
  text,
  size = "md",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const buttonClasses = `
    group relative inline-flex items-center justify-center gap-3
    rounded-full font-medium taviraj
    bg-light-blue text-custume-blue
    border-2 border-light-blue
    hover:bg-light-blue hover:text-custume-blue hover:border-custume-blue
    transition-all duration-300 ease-out
    hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
    focus:outline-none focus:ring-2 focus:ring-custume-blue focus:ring-offset-2
    ${sizeClasses[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const content = (
    <>
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 rounded-full bg-light-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {content}
    </button>
  );
}

export default LightButton;
