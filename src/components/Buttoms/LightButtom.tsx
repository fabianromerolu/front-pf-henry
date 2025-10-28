import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: "md" | "lg" | "xl";
  href?: string;
}

const sizeClasses = {
  md: "text-base py-1 w-50",
  lg: "text-lg py-1.5 w-70",
  xl: "text-xl py-2.5 w-100",
};

function LightButton({
  text,
  size = "md",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const buttonClasses = `
    flex justify-center taviraj rounded-4xl bg-light-blue text-dark-blue hover:bg-custume-blue hover:text-light-blue
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
