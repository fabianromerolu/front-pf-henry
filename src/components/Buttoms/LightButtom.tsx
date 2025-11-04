import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

const sizeClasses = {
  sm: "text-sm px-2 py-2.5 min-w-[200px]",
  md: "text-base px-6 py-2.5 min-w-[300px]",
  lg: "text-lg px-8 py-3 min-w-[350px]",
  xl: "text-xl px-10 py-3.5 min-w-[400px]",
};

function LightButton({
  text,
  size = "md",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const buttonClasses = `
    inline-flex items-center justify-center taviraj
    rounded-full shadow-lg
    bg-light-blue text-dark-blue 
    hover:bg-custume-blue hover:text-light-blue
    border-2 border-light-blue hover:border-light-blue
    transition-all duration-300 ease-in-out
    transform hover:scale-105 hover:shadow-xl
    active:scale-95
    ${sizeClasses[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {text}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {text}
    </button>
  );
}

export default LightButton;
