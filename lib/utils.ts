export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function generateQRCode(data: string): string {
  if (typeof window === "undefined") {
    return `QR-${Buffer.from(data).toString("base64").slice(0, 16).toUpperCase()}`;
  }
  return `QR-${btoa(data).slice(0, 16).toUpperCase()}`;
}
