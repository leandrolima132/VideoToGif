"use client";

import React from "react";

interface FeedbackDisplayProps {
  message: string;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-3 mt-3 rounded bg-gray-50 border border-gray-200 text-gray-700 text-sm">
      {message}
    </div>
  );
};
