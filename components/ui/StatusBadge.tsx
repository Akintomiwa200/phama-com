"use client";

import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

type StatusType = "success" | "warning" | "error" | "info";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
}

const config = {
  success: {
    icon: CheckCircle,
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  error: {
    icon: XCircle,
    classes: "bg-red-50 text-red-700 border-red-200",
  },
  info: {
    icon: Info,
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  const { icon: Icon, classes } = config[status];
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${classes}`}
    >
      <Icon size={18} />
      <span>{text}</span>
    </div>
  );
}
