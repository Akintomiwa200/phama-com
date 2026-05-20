"use client";

import { useState } from "react";
import { ScanLine, Loader2 } from "lucide-react";

interface ScannerProps {
  placeholder?: string;
  onScan: (barcode: string) => void;
  scanning?: boolean;
}

export default function Scanner({
  placeholder = "Enter barcode or scan...",
  onScan,
  scanning = false,
}: ScannerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onScan(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <ScanLine
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          disabled={scanning}
        />
      </div>
      <button
        type="submit"
        disabled={scanning || !value.trim()}
        className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {scanning ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : (
          "Scan"
        )}
      </button>
    </form>
  );
}
