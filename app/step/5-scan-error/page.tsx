"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Barcode, XCircle, AlertTriangle } from "lucide-react";
import StepHeader from "@/components/ui/StepHeader";
import ProgressBar from "@/components/layout/ProgressBar";
import NavButton from "@/components/ui/NavButton";
import Scanner from "@/components/ui/Scanner";
import Alert from "@/components/ui/Alert";

export default function ScanErrorPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<"idle" | "error">("idle");

  const handleScan = (barcode: string) => {
    setScanning(true);
    setResult("idle");

    setTimeout(() => {
      setScanning(false);
      if (barcode === "123456789012") {
        setResult("error");
      } else {
        alert("For this demo, please scan: 123456789012 (wrong strength bottle)");
      }
    }, 1500);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <ProgressBar currentStep={5} />
      <StepHeader
        stepNumber={5}
        title="First Bottle Scan (Error)"
        subtitle="The pharmacist goes to the shelf and picks a bottle. They scan the barcode. Watch what happens."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Barcode className="text-blue-600" size={24} />
          <h2 className="font-bold text-gray-900">Scan Drug Bottle</h2>
        </div>

        <Scanner
          placeholder="Scan barcode (try: 123456789012)"
          onScan={handleScan}
          scanning={scanning}
        />

        <p className="text-xs text-gray-500 mt-2">
          Hint: Barcode 123456789012 = Amlodipine 5mg (wrong strength)
        </p>
      </div>

      {result === "error" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Alert
            type="error"
            title="RED ALERT"
            message="WRONG STRENGTH. Scanned: Amlodipine 5mg. Prescribed: Amlodipine 10mg. Clinical risk: 50% lower dose may cause uncontrolled blood pressure. Do not dispense. Retrieve correct bottle."
          >
            <div className="mt-3 flex items-center gap-2 text-red-700">
              <XCircle size={18} />
              <span className="text-sm font-semibold">Dispensing blocked</span>
            </div>
          </Alert>

          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <span className="font-semibold text-amber-800">Clinical Risk Analysis</span>
            </div>
            <p className="text-sm text-amber-700">
              A 50% lower dose may cause uncontrolled blood pressure, leading to stroke or heart attack risk.
            </p>
          </div>

          <div className="flex justify-between">
            <NavButton href="/step/4-cascade" direction="prev" />
            <NavButton href="/step/6-scan-success" direction="next" label="Retrieve Correct Bottle" />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-1">What the AI is doing</h3>
        <p className="text-sm text-blue-700">
          Comparing the scanned drug to the prescription and stopping the dispensing process immediately when any mismatch is detected.
        </p>
      </div>
    </main>
  );
}
