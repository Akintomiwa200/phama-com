"use client";

import { ReactNode } from "react";

export const TEAL = "#2BBFAA";
export const NAVY = "#1B2D3E";

export type IconName =
  | "flask" | "users" | "clock" | "microscope" | "activity" | "droplets"
  | "search" | "menu" | "x" | "chevron" | "arrowRight" | "check"
  | "mail" | "phone" | "pin" | "beaker" | "atom" | "dna"
  | "fb" | "tw" | "li" | "yt" | "shield" | "alert" | "brain" | "file" | "prescription";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 20, color = TEAL, strokeWidth = 1.8 }: IconProps): ReactNode {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const, stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const sf = { width: size, height: size, viewBox: "0 0 24 24", fill: color };

  const icons: Record<IconName, ReactNode> = {
    flask: (<svg {...s}><path d="M9 3h6M9 3v8l-4.5 7.5A2 2 0 0 0 6.27 21h11.46a2 2 0 0 0 1.77-2.5L15 11V3" /><path d="M6.21 15h11.58" /></svg>),
    users: (<svg {...s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
    clock: (<svg {...s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
    microscope: (<svg {...s}><path d="M6 18h8M3 21h18M14 10a4 4 0 1 0-8 0v1h8v-1zM12 2v8M8 2v3" /></svg>),
    activity: (<svg {...s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>),
    droplets: (<svg {...s}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></svg>),
    search: (<svg {...s}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
    menu: (<svg {...s}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>),
    x: (<svg {...s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
    chevron: (<svg {...s}><polyline points="6 9 12 15 18 9" /></svg>),
    arrowRight: (<svg {...s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
    check: (<svg {...s}><polyline points="20 6 9 17 4 12" /></svg>),
    mail: (<svg {...s}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>),
    phone: (<svg {...s}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
    pin: (<svg {...s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
    beaker: (<svg {...s}><path d="M4.5 3h15M6 3v10l-3.5 6A2 2 0 0 0 4.27 21h15.46a2 2 0 0 0 1.77-2L18 13V3" /><path d="M6 15h12" /></svg>),
    atom: (<svg {...s}><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9C11.2 3.8 5.87 1.78 3.83 3.82c-2.04 2.04-.02 7.37 4.5 11.91S18.16 22.24 20.2 20.2z" /><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.91-2.04-2.04-7.37-.02-11.91 4.5S1.75 18.15 3.79 20.19c2.04 2.04 7.37.02 11.91-4.49z" /></svg>),
    dna: (<svg {...s}><path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /><path d="M15 2c-1.798 1.999-2.518 3.997-2.807 5.994" /><path d="m17 6-2.5-2.5" /><path d="m14 8-1-1" /><path d="m7 18 2.5 2.5" /><path d="m10 16 1 1" /><path d="m16.5 11.5 1 1" /><path d="m20 9 .5.5" /><path d="m6.5 12.5 1 1" /><path d="m3 16 .5.5" /></svg>),
    shield: (<svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    alert: (<svg {...s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill={color} stroke="none" /></svg>),
    brain: (<svg {...s}><path d="M12 4a4 4 0 0 1 3.5 6A4 4 0 0 1 12 18a4 4 0 0 1-3.5-6A4 4 0 0 1 12 4z" /><path d="M18.5 8A5 5 0 0 1 22 12a5 5 0 0 1-3.5 4.8" /><path d="M5.5 8A5 5 0 0 0 2 12a5 5 0 0 0 3.5 4.8" /></svg>),
    file: (<svg {...s}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>),
    prescription: (<svg {...s}><path d="M8 21h8M12 3v18M8 7h8" /><path d="M7 12h10" /></svg>),
    fb: <svg {...sf}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
    tw: <svg {...sf}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.69 4.13A12.83 12.83 0 0 1 2.67.89a4.52 4.52 0 0 0 1.4 6.03A4.47 4.47 0 0 1 2 6.38v.06a4.52 4.52 0 0 0 3.62 4.43 4.52 4.52 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14A9.06 9.06 0 0 1 2 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9 9 0 0 1-2.6.72A4.52 4.52 0 0 0 23 3z" /></svg>,
    li: <svg {...sf}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
    yt: (<svg {...sf}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>),
  };

  return icons[name] || null;
}
