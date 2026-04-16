import type { LDClient } from "launchdarkly-react-client-sdk";

export function trackSafe(
  client: LDClient | undefined,
  name: string,
  data?: Record<string, unknown>,
) {
  if (!client) return;
  try {
    client.track(name, data as Record<string, unknown>);
  } catch {
    /* demo: never break UI on analytics */
  }
}
