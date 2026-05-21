"use client";

import { ReactNode } from "react";
import { TEAL } from "@/components/Icon";

interface EyebrowProps {
  children: ReactNode;
}

export default function Eyebrow({ children }: EyebrowProps): ReactNode {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: TEAL,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          width: 28,
          height: 1.5,
          background: TEAL,
          borderRadius: 1,
          display: "inline-block",
        }}
      />
      {children}
      <span
        style={{
          width: 28,
          height: 1.5,
          background: TEAL,
          borderRadius: 1,
          display: "inline-block",
        }}
      />
    </div>
  );
}
