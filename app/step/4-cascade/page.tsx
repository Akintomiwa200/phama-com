"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Loader2 } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";
import Alert from "@/components/ui/Alert";

export default function CascadePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
      setDetected(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={4} />
      <StepHeader
        stepNumber={4}
        title="AI Checks for Prescribing Cascade"
        subtitle="The AI checks for something called a prescribing cascade. That is when a new drug is prescribed to treat a side effect of an old drug, instead of fixing the original problem."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Stethoscope className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Cascade Pattern Analysis</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Current Medication</p>
            <p className="font-bold text-gray-900">Lisinopril</p>
            <p className="text-xs text-gray-500 mt-1">Known side effect: Dry cough in 10-20% of patients</p>
          </div>

          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">New Prescription</p>
            <p className="font-bold text-gray-900">Amlodipine</p>
            <p className="text-xs text-gray-500 mt-1">Sometimes added when ACE inhibitor cough occurs</p>
          </div>
        </div>

        {checking && (
          <div className="flex items-center justify-center gap-2 py-4 text-blue-600">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Analyzing prescribing patterns...</span>
          </div>
        )}
      </div>

      {detected && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Alert
            type="warning"
            title="CASCADE PATTERN DETECTED"
            message="Patient takes Lisinopril, which causes dry cough in 10-20% of patients. The new drug Amlodipine is sometimes added to treat blood pressure when cough occurs."
          >
            <div className="mt-3 p-3 bg-amber-100/50 rounded-lg border border-amber-200">
              <p className="text-sm font-semibold text-amber-800">
                Please confirm with prescriber: Does the patient have Lisinopril-induced cough?
              </p>
            </div>
          </Alert>

          <div className="flex justify-between">
            <NavButton href="/step/3-interaction" direction="prev" />
            <NavButton href="/step/5-scan-error" direction="next" label="Proceed to Scan" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Recognizing patterns that lead to unnecessary medications by detecting when new prescriptions may be treating side effects rather than underlying conditions.
        </p>
      </div>
    </main>
  );
}
