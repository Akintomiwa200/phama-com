"use client";

import { useState } from "react";
import { Barcode, CheckCircle } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";
import Scanner from "@/components/ui/Scanner";
import Alert from "@/components/ui/Alert";

export default function ScanSuccessPage() {
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleScan = (barcode: string) => {
    setScanning(true);
    setVerified(false);

    setTimeout(() => {
      setScanning(false);
      if (barcode === "123456789013") {
        setVerified(true);
      } else {
        alert("For this demo, please scan: 123456789013 (correct bottle)");
      }
    }, 1500);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={6} />
      <StepHeader
        stepNumber={6}
        title="Second Bottle Scan (Correct)"
        subtitle="The pharmacist retrieves the correct bottle and scans again."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Barcode className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Scan Correct Drug Bottle</h2>
        </div>

        <Scanner
          placeholder="Scan barcode (try: 123456789013)"
          onScan={handleScan}
          scanning={scanning}
        />

        <p className="text-xs text-gray-500 mt-2">
          Hint: Barcode 123456789013 = Amlodipine 10mg (correct strength)
        </p>
      </div>

      {verified && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Alert
            type="success"
            title="GREEN LIGHT"
            message="VERIFIED. Drug name matches. Strength matches. Safe to dispense."
          >
            <div className="mt-3 space-y-2">
              {[
                { label: "Drug Name", value: "Amlodipine", match: true },
                { label: "Strength", value: "10mg", match: true },
                { label: "Form", value: "Tablet", match: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-800">{item.value}</span>
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </Alert>

          <div className="flex justify-between">
            <NavButton href="/step/5-scan-error" direction="prev" />
            <NavButton href="/step/7-injection" direction="next" label="Continue" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Confirming the correct drug name, strength, and form before allowing the dispensing process to continue.
        </p>
      </div>
    </main>
  );
}
