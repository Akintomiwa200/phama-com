"use client";

import { ReactNode } from "react";

interface DotGridProps {
  style?: React.CSSProperties;
}

export default function DotGrid({ style = {} }: DotGridProps): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(43,191,170,0.18) 1.5px, transparent 1.5px)`,
        backgroundSize: "22px 22px",
        ...style,
      }}
    />
  );
}
