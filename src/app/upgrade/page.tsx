import { UpgradeCheckout } from "@/components/UpgradeCheckout";

export const metadata = {
  title: "Upgrade — TraveLD",
};

export default function UpgradePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="font-serif text-3xl font-semibold text-[var(--travel-ink)]">
        Upgrade to Premium
      </h1>
      <p className="mt-2 text-sm text-[var(--travel-muted)]">
        Demo checkout only. Enter any card details—TraveLD marks your local account as
        paid; nothing is charged.
      </p>
      <div className="mt-8 rounded-2xl border border-[var(--travel-border)] bg-[var(--travel-surface)] p-6">
        <UpgradeCheckout />
      </div>
    </div>
  );
}
