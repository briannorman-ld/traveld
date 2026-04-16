"use client";

import { useLDClient } from "launchdarkly-react-client-sdk";
import { useEffect } from "react";
import { useSession } from "@/context/session";
import { buildLdContext } from "@/lib/ld-context";

/**
 * LDProvider initializes the client once; changing its `context` prop does not call `identify`.
 * Keep the JS client in sync with session (login, logout, new anonymous key).
 */
export function LdContextIdentifyEffect() {
  const { anonymousKey, user, ready } = useSession();
  const client = useLDClient();

  useEffect(() => {
    if (!client || !ready || anonymousKey === "pending") return;
    const ctx = buildLdContext({ anonymousKey, user });
    void client.identify(ctx).catch(() => {
      /* demo: never break UI */
    });
  }, [client, ready, anonymousKey, user]);

  return null;
}
