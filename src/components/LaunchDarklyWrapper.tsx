"use client";

import { LDProvider } from "launchdarkly-react-client-sdk";
import { useMemo } from "react";
import { useSession } from "@/context/session";
import { buildLdContext } from "@/lib/ld-context";

const clientSideID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID ?? "";

export function LaunchDarklyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { anonymousKey, user, ready } = useSession();

  const context = useMemo(
    () =>
      buildLdContext({
        anonymousKey: ready ? anonymousKey : "booting",
        user,
      }),
    [anonymousKey, user, ready],
  );

  if (!clientSideID) {
    return <>{children}</>;
  }

  return (
    <LDProvider
      clientSideID={clientSideID}
      context={context}
      reactOptions={{ useCamelCaseFlagKeys: false }}
    >
      {children}
    </LDProvider>
  );
}

export function hasLaunchDarklyClientId(): boolean {
  return Boolean(clientSideID);
}
