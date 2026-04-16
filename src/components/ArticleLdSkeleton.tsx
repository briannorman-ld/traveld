import Link from "next/link";
import type { Article } from "@/lib/articles";

/**
 * Shown while the LaunchDarkly client is initializing to reduce flag-flash mismatch.
 */
export function ArticleLdSkeleton({ article }: { article: Article }) {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10"
      aria-busy
      aria-label="Loading article experience"
    >
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--travel-muted)]">
          <li>
            <Link href="/" className="transition hover:text-[var(--travel-ink)]">
              Home
            </Link>
          </li>
          <li aria-hidden className="select-none text-[var(--travel-border)]">
            /
          </li>
          <li>
            <Link href="/articles" className="transition hover:text-[var(--travel-ink)]">
              Articles
            </Link>
          </li>
          <li aria-hidden className="select-none text-[var(--travel-border)]">
            /
          </li>
          <li className="min-w-0 max-w-full">
            <span
              className="line-clamp-2 font-medium text-[var(--travel-ink)]"
              aria-current="page"
            >
              {article.title}
            </span>
          </li>
        </ol>
      </nav>
      <div className="animate-pulse">
      <div className="h-3 w-24 rounded bg-[var(--travel-sand)]" />
      <div className="mt-4 h-9 max-w-xl rounded bg-[var(--travel-sand)]" />
      <div className="mt-3 h-4 w-48 rounded bg-[var(--travel-sand)]" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-[var(--travel-sand)]" />
        <div className="h-4 w-full rounded bg-[var(--travel-sand)]" />
        <div className="h-4 w-full max-w-2xl rounded bg-[var(--travel-sand)]" />
        <div className="h-4 w-full rounded bg-[var(--travel-sand)]" />
        <p className="pt-4 text-xs text-[var(--travel-muted)]">
          Loading flags for: {article.title}
        </p>
      </div>
      </div>
    </div>
  );
}
