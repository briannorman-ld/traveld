"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SignupForm } from "@/components/SignupForm";
import { normalizePostAuthReturnTo } from "@/lib/return-to";

export function SignupView() {
  const searchParams = useSearchParams();
  const returnTo = useMemo(
    () => normalizePostAuthReturnTo(searchParams.get("returnTo")),
    [searchParams],
  );
  const loginHref =
    returnTo != null
      ? `/login?returnTo=${encodeURIComponent(returnTo)}`
      : "/login";

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-serif text-3xl font-semibold text-[var(--travel-ink)]">
        Create a free account
      </h1>
      <p className="mt-2 text-sm text-[var(--travel-muted)]">
        Demo auth: passwords are stored in plain text in <code>localStorage</code>. Do
        not reuse a real password.
      </p>
      <div className="mt-8 rounded-2xl border border-[var(--travel-border)] bg-[var(--travel-surface)] p-6">
        <SignupForm returnTo={returnTo} />
      </div>
      <p className="mt-6 text-center text-sm text-[var(--travel-muted)]">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-[var(--travel-sea)] underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
