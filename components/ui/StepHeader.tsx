"use client";

import { Pill } from "lucide-react";

interface StepHeaderProps {
  stepNumber: number;
  totalSteps?: number;
  title: string;
  subtitle: string;
}

export default function StepHeader({
  stepNumber,
  totalSteps = 10,
  title,
  subtitle,
}: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          <Pill size={18} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}
