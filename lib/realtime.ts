import type { AppState } from "./store";

type Listener = (state: Partial<AppState>) => void;

export function subscribeToRealtime(onUpdate: Listener): () => void {
  let eventSource: EventSource | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  function connect() {
    if (closed) return;

    eventSource = new EventSource("/api/realtime");

    eventSource.addEventListener("sync", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch {
        // malformed data
      }
    });

    eventSource.addEventListener("error", () => {
      eventSource?.close();

      if (!closed) {
        reconnectTimer = setTimeout(connect, 3000);
      }
    });

    eventSource.onopen = () => {
      // connected
    };
  }

  connect();

  return () => {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    eventSource?.close();
  };
}
