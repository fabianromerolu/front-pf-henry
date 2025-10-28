import React from "react";

interface ButtonProps {
  className: string;
  text: string;
}

function DarkButtom({ text }: ButtonProps) {
  return (
    <button
      className="bg-light-blue taviraj w-full text-3xl text-dark-blue p-2 rounded-4xl hover:bg-custume-blue hover:text-custume-light"
      type="submit"
    >
      {text}
    </button>
  );
}

export default DarkButtom;
