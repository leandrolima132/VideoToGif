"use client";

import React from "react";

interface ProgressBarProps {
  progress: number; // 0 a 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  if (progress <= 0) {
    return <div />;
  }
  const rounded = Math.round(progress);
  return (

    <div className="space-y-2 ">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progresso</span>
        <span>{rounded}%</span>
      </div>
      <div
        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${rounded}%` }}
      />
    </div>
  );
};

