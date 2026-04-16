"use client";

import Link from "next/link";
import { CreateAccountLink } from "@/components/CreateAccountLink";
import { useSession } from "@/context/session";

export default function AccountPage() {
  const session = useSession();

  if (!session.ready) {
    return (
      <div className="mx-auto max-w-lg px-4 py-14 text-sm text-[var(--travel-muted)]">
        Loading…
      </div>
    );
  }

  if (!session.user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-14">
        <h1 className="font-serif text-3xl font-semibold text-[var(--travel-ink)]">
          Account
        </h1>
        <p className="mt-2 text-sm text-[var(--travel-muted)]">
          You are browsing anonymously. Create an account to save preferences in this
          demo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CreateAccountLink
            href="/signup"
            source="account_anonymous"
            className="rounded-full bg-gradient-to-r from-[var(--travel-sea-deep)] to-[var(--travel-sea)] px-4 py-2 text-sm font-medium text-white shadow-[0_0_16px_-6px_var(--travel-glow)]"
          >
            Sign up
          </CreateAccountLink>
          <Link
            href="/login"
            className="rounded-full border border-[var(--travel-border)] px-4 py-2 text-sm font-medium text-[var(--travel-ink)]"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="font-serif text-3xl font-semibold text-[var(--travel-ink)]">
        Account
      </h1>
      <dl className="mt-8 space-y-4 rounded-2xl border border-[var(--travel-border)] bg-[var(--travel-surface)] p-6 text-sm">
        <div>
          <dt className="text-[var(--travel-muted)]">Email</dt>
          <dd className="font-medium text-[var(--travel-ink)]">{session.user.email}</dd>
        </div>
        <div>
          <dt className="text-[var(--travel-muted)]">Tier</dt>
          <dd className="font-medium capitalize text-[var(--travel-ink)]">
            {session.user.tier}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--travel-muted)]">Member since</dt>
          <dd className="font-medium text-[var(--travel-ink)]">
            {new Date(session.user.createdAt).toLocaleString()}
          </dd>
        </div>
      </dl>
      {session.user.tier === "free" ? (
        <div className="mt-8">
          <Link
            href="/upgrade"
            className="inline-flex justify-center rounded-full bg-gradient-to-r from-[var(--travel-sea-deep)] to-[var(--travel-sea)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_-6px_var(--travel-glow)]"
          >
            Upgrade to Premium
          </Link>
        </div>
      ) : null}
    </div>
  );
}
