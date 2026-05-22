import type { AppState } from "./store";

type Listener = (state: Partial<AppState>) => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function broadcast(state: Partial<AppState>) {
  for (const listener of listeners) {
    try {
      listener(state);
    } catch {
      // ignore broken listener
    }
  }
}

export function listenerCount() {
  return listeners.size;
}
