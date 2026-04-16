import { useSyncExternalStore } from "react";

export type DemoTrackEvent = {
  at: number;
  name: string;
  data?: Record<string, unknown>;
};

const MAX = 80;
const listeners = new Set<() => void>();

/** Stable reference for SSR — `useSyncExternalStore` requires getServerSnapshot to be cached. */
const EMPTY_SERVER_SNAPSHOT: readonly DemoTrackEvent[] = [];

let snapshot: readonly DemoTrackEvent[] = EMPTY_SERVER_SNAPSHOT;

function notify() {
  for (const l of listeners) l();
}

export function recordDemoTrackEvent(entry: {
  name: string;
  data?: Record<string, unknown>;
  at?: number;
}) {
  const row: DemoTrackEvent = {
    at: entry.at ?? Date.now(),
    name: entry.name,
    data: entry.data,
  };
  snapshot = [...snapshot.slice(-(MAX - 1)), row];
  notify();
}

export function clearDemoTrackEvents() {
  snapshot = EMPTY_SERVER_SNAPSHOT;
  notify();
}

export function useDemoTrackEvents(): readonly DemoTrackEvent[] {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => snapshot,
    () => EMPTY_SERVER_SNAPSHOT,
  );
}
