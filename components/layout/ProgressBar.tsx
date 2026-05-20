"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps = 10,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
