"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CreateAccountLink } from "@/components/CreateAccountLink";
import { LoginForm } from "@/components/LoginForm";
import { normalizePostAuthReturnTo } from "@/lib/return-to";

export function LoginView() {
  const searchParams = useSearchParams();
  const returnTo = useMemo(
    () => normalizePostAuthReturnTo(searchParams.get("returnTo")),
    [searchParams],
  );
  const signupHref =
    returnTo != null
      ? `/signup?returnTo=${encodeURIComponent(returnTo)}`
      : "/signup";

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-serif text-3xl font-semibold text-[var(--travel-ink)]">
        Log in
      </h1>
      <p className="mt-2 text-sm text-[var(--travel-muted)]">
        Use the email and password you chose at sign-up.
      </p>
      <div className="mt-8 rounded-2xl border border-[var(--travel-border)] bg-[var(--travel-surface)] p-6">
        <LoginForm returnTo={returnTo} />
      </div>
      <p className="mt-6 text-center text-sm text-[var(--travel-muted)]">
        New here?{" "}
        <CreateAccountLink
          href={signupHref}
          source="login_prompt"
          className="font-medium text-[var(--travel-sea)] underline"
        >
          Create an account
        </CreateAccountLink>
      </p>
    </div>
  );
}
