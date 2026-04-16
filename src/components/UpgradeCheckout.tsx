"use client";

import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/context/session";
import { FLAG_KEYS, DEFAULT_FLAGS } from "@/lib/flags";
import { hasLaunchDarklyClientId } from "@/components/LaunchDarklyWrapper";
import { trackSafe } from "@/lib/track";

const HAS_LD = hasLaunchDarklyClientId();

export function UpgradeCheckout() {
  if (HAS_LD) return <UpgradeCheckoutWithLd />;
  return <UpgradeCheckoutNoLd />;
}

function UpgradeCheckoutNoLd() {
  const session = useSession();
  const router = useRouter();
  const [card, setCard] = useState("");
  const [done, setDone] = useState(false);

  if (!session.user) {
    return (
      <p className="text-sm text-[var(--travel-muted)]">
        Please{" "}
        <a className="font-medium text-[var(--travel-sea)] underline" href="/login">
          log in
        </a>{" "}
        before upgrading.
      </p>
    );
  }

  if (session.user.tier === "paid") {
    return (
      <p className="text-sm text-[var(--travel-muted)]">
        You already have TraveLD Premium (demo).
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    session.setPaidTier();
    setDone(true);
    router.push("/account");
  };

  if (done) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-[var(--travel-muted)]">
        This is a fake checkout. Any card number works; nothing is charged.
      </p>
      <div>
        <label className="block text-sm font-medium">Name on card</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
          placeholder="Jordan Lee"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Card number</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          placeholder="4242 4242 4242 4242"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-[var(--travel-sea-deep)] to-[var(--travel-sea)] py-2.5 font-medium text-white shadow-[0_0_20px_-6px_var(--travel-glow)]"
      >
        Complete upgrade (demo)
      </button>
    </form>
  );
}

function UpgradeCheckoutWithLd() {
  const flags = useFlags();
  const ldClient = useLDClient();
  const session = useSession();
  const router = useRouter();
  const [card, setCard] = useState("");
  const [done, setDone] = useState(false);

  const altLayout = Boolean(
    flags[FLAG_KEYS.checkoutLayout] ?? DEFAULT_FLAGS[FLAG_KEYS.checkoutLayout],
  );

  if (!session.user) {
    return (
      <p className="text-sm text-[var(--travel-muted)]">
        Please{" "}
        <a className="font-medium text-[var(--travel-sea)] underline" href="/login">
          log in
        </a>{" "}
        before upgrading.
      </p>
    );
  }

  if (session.user.tier === "paid") {
    return (
      <p className="text-sm text-[var(--travel-muted)]">
        You already have TraveLD Premium (demo).
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackSafe(ldClient, "checkout_started", { plan: "premium_demo" });
    session.setPaidTier();
    trackSafe(ldClient, "checkout_completed", { plan: "premium_demo" });
    setDone(true);
    router.push("/account");
  };

  if (done) return null;

  return (
    <form
      onSubmit={onSubmit}
      className={
        altLayout
          ? "space-y-4 rounded-2xl border-2 border-dashed border-[var(--travel-sea)] bg-[var(--travel-surface)] p-6"
          : "space-y-4"
      }
    >
      <p className="text-sm text-[var(--travel-muted)]">
        This is a fake checkout. Any card number works; nothing is charged.
      </p>
      {altLayout ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--travel-border)] bg-[var(--travel-input)] p-4 shadow-inner">
            <h3 className="font-semibold text-[var(--travel-ink)]">TraveLD Premium</h3>
            <p className="mt-2 text-sm text-[var(--travel-muted)]">
              Unlimited articles, offline packs (pretend), and priority maps
              (also pretend).
            </p>
            <p className="mt-4 text-2xl font-bold">$12</p>
            <p className="text-xs text-[var(--travel-muted)]">per month · demo</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Name on card</label>
              <input className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Card number</label>
              <input
                className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium">Name on card</label>
            <input className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Card number</label>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
          </div>
        </>
      )}
      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-[var(--travel-sea-deep)] to-[var(--travel-sea)] py-2.5 font-medium text-white shadow-[0_0_20px_-6px_var(--travel-glow)]"
      >
        Complete upgrade (demo)
      </button>
      <p className="text-xs text-[var(--travel-muted)]">
        Flag <code>checkout-layout</code> is {String(altLayout)} (A/B layout).
      </p>
    </form>
  );
}
