import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleExperience } from "@/components/ArticleExperience";
import { getAllSlugs, getArticleBySlug } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article — TraveLD" };
  return {
    title: `${article.title} — TraveLD`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleExperience article={article} />;
}
