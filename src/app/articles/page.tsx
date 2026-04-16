import { ArticlesIndex } from "@/components/ArticlesIndex";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Articles — TraveLD",
};

export default function ArticlesPage() {
  const articles = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    tags: a.tags,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold text-[var(--travel-ink)]">
        All articles
      </h1>
      <ArticlesIndex articles={articles} />
    </div>
  );
}
