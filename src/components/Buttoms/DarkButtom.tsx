import React from "react";

interface ButtonProps {
  className: string;
  text: string;
}

function LightButtom({ text }: ButtonProps) {
  return (
    <button
      className="bg-costume-blue taviraj w-full text-3xl text-custume-light p-2 rounded-4xl"
      type="submit"
    >
      {text}
    </button>
  );
}

export default LightButtom;
