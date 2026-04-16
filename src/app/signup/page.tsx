import { Suspense } from "react";
import { SignupView } from "./signup-view";

export const metadata = {
  title: "Sign up — TraveLD",
};

function SignupFallback() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 text-sm text-[var(--travel-muted)]">
      Loading…
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupView />
    </Suspense>
  );
}
