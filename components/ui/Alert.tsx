"use client";

import { AlertTriangle, XCircle, Info, CheckCircle } from "lucide-react";

type AlertType = "error" | "warning" | "success" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  children?: React.ReactNode;
}

const config = {
  error: {
    icon: XCircle,
    classes: "bg-red-50 border-red-200 text-red-800",
    iconColor: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-50 border-amber-200 text-amber-800",
    iconColor: "text-amber-600",
  },
  success: {
    icon: CheckCircle,
    classes: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-600",
  },
  info: {
    icon: Info,
    classes: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-600",
  },
};

export default function Alert({ type, title, message, children }: AlertProps) {
  const { icon: Icon, classes, iconColor } = config[type];
  return (
    <div className={`rounded-xl border p-5 ${classes}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 shrink-0 ${iconColor}`} size={22} />
        <div className="flex-1">
          <h3 className="font-bold text-sm uppercase tracking-wide mb-1">
            {title}
          </h3>
          <p className="text-sm leading-relaxed">{message}</p>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
