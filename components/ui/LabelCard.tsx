"use client";

import { QrCode } from "lucide-react";

interface LabelCardProps {
  patientName: string;
  drugName: string;
  strength: string;
  dose: string;
  quantity: number;
  date: string;
  qrCode: string;
}

export default function LabelCard({
  patientName,
  drugName,
  strength,
  dose,
  quantity,
  date,
  qrCode,
}: LabelCardProps) {
  return (
    <div className="bg-white border-2 border-gray-900 rounded-lg p-6 max-w-md mx-auto shadow-lg">
      <div className="border-b-2 border-gray-900 pb-3 mb-4">
        <h3 className="text-center font-bold text-lg uppercase tracking-widest">
          Pharmacy Label
        </h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">PATIENT:</span>
          <span className="font-bold text-gray-900">{patientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">DRUG:</span>
          <span className="font-bold text-gray-900">
            {drugName} {strength}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">DOSE:</span>
          <span className="font-bold text-gray-900">{dose}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">QUANTITY:</span>
          <span className="font-bold text-gray-900">{quantity} tablets</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">DATE:</span>
          <span className="font-bold text-gray-900">{date}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-gray-300 flex items-center justify-center gap-3">
        <QrCode size={40} className="text-gray-900" />
        <div className="text-xs text-gray-600">
          <p className="font-mono">{qrCode}</p>
          <p>Scan to verify authenticity</p>
        </div>
      </div>
    </div>
  );
}
