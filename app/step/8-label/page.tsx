"use client";

import { useEffect, useState } from "react";
import { Printer, Loader2 } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";
import LabelCard from "@/components/ui/LabelCard";

export default function LabelPage() {
  const [printing, setPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      setPrinting(false);
      setPrinted(true);
    }, 2000);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={8} />
      <StepHeader
        stepNumber={8}
        title="AI Generates the Label"
        subtitle="Once everything is verified, the AI automatically prints the label."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Printer className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Label Generation</h2>
        </div>

        {!printed && (
          <button
            onClick={handlePrint}
            disabled={printing}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {printing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating label...
              </>
            ) : (
              <>
                <Printer size={18} />
                Generate & Print Label
              </>
            )}
          </button>
        )}
      </div>

      {printed && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <LabelCard
            patientName="Mrs. Folake E."
            drugName="Amlodipine"
            strength="10mg"
            dose="One tablet daily"
            quantity={30}
            date="19/05/2026"
            qrCode="QR-QU5PVU5DRU1FTlQ"
          />

          <div className="flex justify-between">
            <NavButton href="/step/7-injection" direction="prev" />
            <NavButton href="/step/9-audit-log" direction="next" label="View Audit Log" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Eliminating manual typing and spelling errors by auto-generating the label from verified prescription data. QR code enables patients to verify authenticity.
        </p>
      </div>
    </main>
  );
}
