"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface NavButtonProps {
  href?: string;
  onClick?: () => void;
  direction: "next" | "prev" | "start";
  label?: string;
  disabled?: boolean;
}

export default function NavButton({
  href,
  onClick,
  direction,
  label,
  disabled = false,
}: NavButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors";

  const variants = {
    next: "bg-blue-600 text-white hover:bg-blue-700",
    start: "bg-green-600 text-white hover:bg-green-700",
    prev: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  const content = (
    <>
      {direction === "prev" && <ArrowLeft size={16} />}
      <span>
        {label ||
          (direction === "next"
            ? "Continue"
            : direction === "prev"
            ? "Go Back"
            : "Start")}
      </span>
      {direction === "next" && <ArrowRight size={16} />}
    </>
  );

  const classes = `${baseClasses} ${variants[direction]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}
