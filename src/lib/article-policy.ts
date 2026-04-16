import type { LDFlagSet } from "launchdarkly-react-client-sdk";
import {
  DEFAULT_FLAGS,
  FLAG_KEYS,
  readDailyLimitVariation,
  readMessagingVariation,
  readPayWallMode,
  type DailyLimitVariation,
  type MessagingVariation,
  type PayWallMode,
} from "@/lib/flags";
import type { UserTier } from "@/lib/ld-context";
import {
  countDistinctFullViewsToday,
  hasFullViewedToday,
} from "@/lib/article-views";

export type ArticleSurface = "full" | "preview" | "blocked" | "limit";

export type ArticlePolicy = {
  payWall: PayWallMode;
  dailyLimit: DailyLimitVariation;
  messaging: MessagingVariation;
  surface: ArticleSurface;
  /** Whether viewing full body counts toward daily cap / metrics */
  countsAsFullView: boolean;
  showSignupGate: boolean;
  showPreviewTeaser: boolean;
  limitReached: boolean;
};

function mergeFlags(flags: LDFlagSet | null | undefined): LDFlagSet {
  return { ...DEFAULT_FLAGS, ...(flags ?? {}) };
}

export function evaluateArticlePolicy(input: {
  flags: LDFlagSet | null | undefined;
  effectiveTier: UserTier;
  userIdForLimit: string | null;
  slug: string;
}): ArticlePolicy {
  const f = mergeFlags(input.flags);
  const payWall = readPayWallMode(f[FLAG_KEYS.payWall]);
  const dailyLimit = readDailyLimitVariation(f[FLAG_KEYS.freeDailyArticleLimit]);
  const messaging = readMessagingVariation(f[FLAG_KEYS.upgradeMessaging]);

  const { effectiveTier, userIdForLimit, slug } = input;

  let surface: ArticleSurface = "full";
  let countsAsFullView = true;
  let showSignupGate = false;
  let showPreviewTeaser = false;
  let limitReached = false;

  if (payWall === "no_paywall") {
    if (
      effectiveTier === "free" &&
      dailyLimit === "limit_2_per_day" &&
      userIdForLimit
    ) {
      const already = hasFullViewedToday(userIdForLimit, slug);
      const count = countDistinctFullViewsToday(userIdForLimit);
      if (!already && count >= 2) {
        limitReached = true;
        surface = "limit";
        countsAsFullView = false;
      }
    }
    return {
      payWall,
      dailyLimit,
      messaging,
      surface,
      countsAsFullView,
      showSignupGate,
      showPreviewTeaser,
      limitReached,
    };
  }

  if (effectiveTier === "anonymous") {
    if (payWall === "hide_full_article") {
      surface = "blocked";
      countsAsFullView = false;
      showSignupGate = true;
    } else if (payWall === "hide_partial_article") {
      surface = "preview";
      countsAsFullView = false;
      showPreviewTeaser = true;
    }
  } else if (effectiveTier === "free") {
    if (dailyLimit === "limit_2_per_day" && userIdForLimit) {
      const already = hasFullViewedToday(userIdForLimit, slug);
      const count = countDistinctFullViewsToday(userIdForLimit);
      if (!already && count >= 2) {
        limitReached = true;
        surface = "limit";
        countsAsFullView = false;
      }
    }
  }

  return {
    payWall,
    dailyLimit,
    messaging,
    surface,
    countsAsFullView,
    showSignupGate,
    showPreviewTeaser,
    limitReached,
  };
}
