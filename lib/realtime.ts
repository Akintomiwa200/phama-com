import type { AppState } from "./store";

type Listener = (state: Partial<AppState>) => void;

export function initLocalRealTimeUpdates(onUpdate: Listener): () => void {
  let lastData: string | null = null;

  const poll = async () => {
    try {
      const res = await fetch("/api/sync");
      if (!res.ok) return;
      const data = await res.json();
      const serialized = JSON.stringify(data);
      if (serialized !== lastData) {
        lastData = serialized;
        onUpdate(data);
      }
    } catch {
      // silently fail — will retry on next interval
    }
  };

  poll();
  const interval = setInterval(poll, 15000);

  return () => clearInterval(interval);
}
