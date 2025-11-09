import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
      <div className="bg-custume-blue/10 rounded-lg p-2">{icon}</div>
      <h2 className="text-2xl font-bold text-custume-blue taviraj">{title}</h2>
    </div>
  );
}
