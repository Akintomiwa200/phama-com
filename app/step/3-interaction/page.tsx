"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, Loader2 } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";
import Alert from "@/components/ui/Alert";

export default function InteractionPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [found, setFound] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      setFound(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={3} />
      <StepHeader
        stepNumber={3}
        title="AI Checks for Drug Interactions"
        subtitle="The AI now checks if the new drug will react badly with any of the patient's current medications."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Scanning Patient's Drug List</h2>
        </div>

        <div className="space-y-3 mb-6">
          {["Metformin", "Simvastatin", "Lisinopril"].map((drug, i) => (
            <div
              key={drug}
              className="flex items-center gap-3 p-3 rounded-lg border transition-all"
              style={{
                backgroundColor: scanning && i <= 1 ? "#eff6ff" : "#f9fafb",
                borderColor: scanning && i <= 1 ? "#bfdbfe" : "#e5e7eb",
              }}
            >
              {scanning && i <= 1 ? (
                <Loader2 size={18} className="animate-spin text-blue-600" />
              ) : (
                <div className="w-[18px] h-[18px] rounded-full bg-green-500 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">{drug}</span>
              {scanning && i <= 1 && (
                <span className="text-xs text-blue-600 ml-auto animate-pulse">Analyzing...</span>
              )}
            </div>
          ))}
        </div>

        {scanning && (
          <div className="flex items-center justify-center gap-2 py-4 text-blue-600">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Comparing against interaction database...</span>
          </div>
        )}
      </div>

      {found && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Alert
            type="error"
            title="INTERACTION FOUND"
            message="Amlodipine + Simvastatin = High risk of muscle damage and kidney failure. Contact prescriber before dispensing."
          />

          <div className="flex justify-between">
            <NavButton href="/step/2-prescription" direction="prev" />
            <NavButton href="/step/4-cascade" direction="next" label="Continue to Cascade Check" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Comparing the new drug against a comprehensive database of dangerous drug pairs to prevent adverse reactions.
        </p>
      </div>
    </main>
  );
}
