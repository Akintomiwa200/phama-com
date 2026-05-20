import Link from "next/link";
import { Shield, ArrowRight, Pill, Activity, ScanLine, FileText, HeartPulse } from "lucide-react";

const features = [
  {
    icon: <Shield size={20} />,
    title: "Identity Verification",
    desc: "Secure pharmacist login with authorization checks",
  },
  {
    icon: <Pill size={20} />,
    title: "Drug Interaction Detection",
    desc: "Real-time scanning for dangerous drug combinations",
  },
  {
    icon: <Activity size={20} />,
    title: "Prescribing Cascade Alerts",
    desc: "Detects unnecessary medications from side effects",
  },
  {
    icon: <ScanLine size={20} />,
    title: "Barcode Verification",
    desc: "Double-check every bottle before dispensing",
  },
  {
    icon: <FileText size={20} />,
    title: "Auto Label Generation",
    desc: "Eliminate manual typing and spelling errors",
  },
  {
    icon: <HeartPulse size={20} />,
    title: "Immutable Audit Logs",
    desc: "Permanent tamper-proof records for compliance",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 11-8-8-8.6 8.6a2.12 2.12 0 0 0 0 3l8.6 8.6a2.12 2.12 0 0 0 3 0L21.4 14a2.12 2.12 0 0 0 0-3Z" />
            <path d="M9 13l6-6" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Pharmacy AI Safety System
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          A demonstration of AI-powered medication dispensing safety checks.
          Follow all 10 steps to see how the system prevents errors and protects patients.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {f.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/step/1-login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Start Demo
          <ArrowRight size={20} />
        </Link>
        <p className="text-xs text-gray-400 mt-3">
          Use ID <span className="font-mono">PANS2024</span> to begin the pharmacist workflow
        </p>
      </div>
    </div>
  );
}
