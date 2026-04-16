"use client";

import Link from "next/link";
import { useLDClient } from "launchdarkly-react-client-sdk";
import type { ComponentProps } from "react";
import { hasLaunchDarklyClientId } from "@/components/LaunchDarklyWrapper";
import type { CreateAccountClickSource } from "@/lib/create-account-tracking";
import { trackSafe } from "@/lib/track";

type Props = ComponentProps<typeof Link> & {
  source: CreateAccountClickSource;
  /** Merged into the standard event payload (e.g. `slug` from article context). */
  eventData?: Record<string, unknown>;
};

function CreateAccountLinkWithLd({
  href,
  source,
  eventData,
  onClick,
  ...rest
}: Props) {
  const ldClient = useLDClient();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        trackSafe(ldClient, "create_account_clicked", { source, ...eventData });
        onClick?.(e);
      }}
    />
  );
}

/**
 * Fires `create_account_clicked` with `{ source, ...eventData }` when LaunchDarkly is configured.
 * Use for every UI path that navigates toward sign-up; add paywall-specific events in `onClick` when needed.
 */
export function CreateAccountLink(props: Props) {
  if (!hasLaunchDarklyClientId()) {
    const { source: _s, eventData: _e, ...rest } = props;
    return <Link {...rest} />;
  }
  return <CreateAccountLinkWithLd {...props} />;
}
