import React from "react";

interface ButtonProps {
  className: string;
  text: string;
}

function LightButtom({ text }: ButtonProps) {
  return (
    <button
      className="bg-custume-blue font-taviraj w-full text-xl text-custume-light p-2 rounded-4xl"
      type="submit"
    >
      {text}
    </button>
  );
}

export default LightButtom;
