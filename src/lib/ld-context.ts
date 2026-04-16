import type { LDContext } from "launchdarkly-react-client-sdk";

export type UserTier = "anonymous" | "free" | "paid";

export type SessionUser = {
  id: string;
  email: string;
  tier: Exclude<UserTier, "anonymous">;
  createdAt: string;
};

export function buildLdContext(params: {
  anonymousKey: string;
  user: SessionUser | null;
}): LDContext {
  const { anonymousKey, user } = params;
  if (user) {
    return {
      kind: "user",
      key: user.id,
      email: user.email,
      tier: user.tier,
      accountCreatedAt: user.createdAt,
    };
  }
  return {
    kind: "user",
    key: anonymousKey,
    tier: "anonymous",
    anonymous: true,
  };
}
