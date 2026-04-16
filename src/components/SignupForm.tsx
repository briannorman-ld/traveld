"use client";

import { useLDClient } from "launchdarkly-react-client-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/context/session";
import { hasLaunchDarklyClientId } from "@/components/LaunchDarklyWrapper";
import { trackSafe } from "@/lib/track";

const HAS_LD = hasLaunchDarklyClientId();

type SignupFormProps = {
  /** Safe in-app path (e.g. `/articles/slug`) or null to use default redirect. */
  returnTo?: string | null;
};

export function SignupForm({ returnTo = null }: SignupFormProps) {
  if (HAS_LD) return <SignupFormWithLd returnTo={returnTo} />;
  return <SignupFormNoLd returnTo={returnTo} />;
}

function SignupFormNoLd({ returnTo }: SignupFormProps) {
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = session.signup(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(returnTo ?? "/articles");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-[var(--travel-sea-deep)] to-[var(--travel-sea)] py-2.5 font-medium text-white shadow-[0_0_20px_-6px_var(--travel-glow)]"
      >
        Create free account
      </button>
    </form>
  );
}

function SignupFormWithLd({ returnTo }: SignupFormProps) {
  const ldClient = useLDClient();
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = session.signup(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    trackSafe(ldClient, "account_created", { tier: "free" });
    trackSafe(ldClient, "signup_completed", { tier: "free" });
    router.push(returnTo ?? "/articles");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          className="mt-1 w-full rounded-lg border border-[var(--travel-border)] bg-[var(--travel-input)] px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-[var(--travel-sea-deep)] to-[var(--travel-sea)] py-2.5 font-medium text-white shadow-[0_0_20px_-6px_var(--travel-glow)]"
      >
        Create free account
      </button>
    </form>
  );
}
