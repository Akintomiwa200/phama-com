import { loadAppState } from "@/lib/load-app-state";
import { subscribe } from "@/lib/realtime-hub";
import { isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isMongoConfigured()) {
    return new Response("MongoDB not configured", { status: 503 });
  }

  const encoder = new TextEncoder();
  let closed = false;
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: sync\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        send(await loadAppState());
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data";
        send({ dbConnected: false, error: message });
      }

      unsubscribe = subscribe((partial) => send(partial));

      heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 25000);
    },
    cancel() {
      closed = true;
      if (heartbeat) clearInterval(heartbeat);
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
