import type { LDClient } from "launchdarkly-react-client-sdk";
import { recordDemoTrackEvent } from "@/lib/ld-demo-event-log";

export function trackSafe(
  client: LDClient | undefined,
  name: string,
  data?: Record<string, unknown>,
) {
  if (!client) return;
  try {
    client.track(name, data as Record<string, unknown>);
    recordDemoTrackEvent({ name, data });
  } catch {
    /* demo: never break UI on analytics */
  }
}
