"use client";

import { CreateAccountLink } from "@/components/CreateAccountLink";

/** Hero “Create free account” — same destination as `/signup`, tracks `create_account_clicked`. */
export function HeroSignupCta() {
  return (
    <CreateAccountLink
      href="/signup"
      source="hero"
      className="rounded-full border border-white/40 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10"
    >
      Create free account
    </CreateAccountLink>
  );
}
