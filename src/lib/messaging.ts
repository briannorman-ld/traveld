import type { MessagingVariation } from "@/lib/flags";

export type GateCopy = {
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta?: string;
};

const copy: Record<MessagingVariation, GateCopy> = {
  default: {
    title: "Create a free TraveLD account to view the rest of the article",
    body: "Save itineraries, sync preferences, and unlock the full story.",
    primaryCta: "Create free account",
    secondaryCta: "Log in",
  },
  urgency: {
    title: "Don’t lose this itinerary",
    body: "Free members keep full access to guides and maps—takes under a minute.",
    primaryCta: "Claim free access",
    secondaryCta: "I already have an account",
  },
  social_proof: {
    title: "Join 120k+ travelers on TraveLD",
    body: "Readers with free accounts finish more trips—and revisit articles 3× more often.",
    primaryCta: "Create free account",
    secondaryCta: "Log in",
  },
};

export function getGateMessaging(variation: MessagingVariation): GateCopy {
  return copy[variation] ?? copy.default;
}

export function getUpgradeLimitCopy(variation: MessagingVariation): GateCopy {
  const base = copy[variation] ?? copy.default;
  return {
    title: "Daily article limit reached",
    body:
      variation === "urgency"
        ? "You’ve hit today’s free limit—upgrade to keep exploring without friction."
        : variation === "social_proof"
          ? "Most paid members upgrade after their second trip plan—unlock unlimited reads."
          : "Free accounts can read two full articles per day. Upgrade for unlimited access.",
    primaryCta: "View plans (demo)",
    secondaryCta: base.secondaryCta,
  };
}
