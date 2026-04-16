"use client";

import { SessionProvider } from "@/context/session";
import { LaunchDarklyWrapper } from "@/components/LaunchDarklyWrapper";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LaunchDarklyWrapper>{children}</LaunchDarklyWrapper>
    </SessionProvider>
  );
}
