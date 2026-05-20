"use client";

import { CheckCircle, HeartPulse, RotateCcw } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";

const safetyChecks = [
  "Identity verified: Pharmacist PANS2024 authorized",
  "Prescription read: Amlodipine 10mg for Mrs. Folake E.",
  "Drug interaction detected: Amlodipine + Simvastatin flagged",
  "Prescriber consulted: Dose adjusted",
  "Cascade pattern checked: No cough confirmed",
  "Barcode scan #1: Wrong strength (5mg) blocked",
  "Barcode scan #2: Correct strength (10mg) verified",
  "Injection check: Preparation verified (if applicable)",
  "Label generated: Auto-printed with QR code",
  "Audit log: All actions saved permanently",
];

export default function CompletePage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={10} />
      <StepHeader
        stepNumber={10}
        title="Pharmacist Gives Medication to Patient"
        subtitle="The pharmacist now hands the verified, correctly labeled medication to the patient."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <HeartPulse className="text-green-600" size={40} />
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-gray-900 mb-2">
          Every Safety Check Has Passed
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Every error has been caught. The patient is safe.
        </p>

        <div className="space-y-2">
          {safetyChecks.map((check, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100"
            >
              <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
              <span className="text-sm text-green-800">{check}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-center max-w-md">
          <p className="text-sm text-blue-800 font-semibold mb-1">
            Patient Safety Summary
          </p>
          <p className="text-sm text-blue-700">
            Mrs. Folake E. received the correct medication at the correct dose.
            No drug interactions were missed. No wrong-strength errors reached the patient.
          </p>
        </div>

        <NavButton
          href="/"
          direction="start"
          label="Restart Demo"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Closing the dispensing loop with full traceability. The system ensures no medication leaves the pharmacy without passing every required safety verification.
        </p>
      </div>
    </main>
  );
}
