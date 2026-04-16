import { Suspense } from "react";
import { LoginView } from "./login-view";

export const metadata = {
  title: "Log in — TraveLD",
};

function LoginFallback() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 text-sm text-[var(--travel-muted)]">
      Loading…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginView />
    </Suspense>
  );
}
