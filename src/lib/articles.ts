import articlesData from "../../content/articles.json";

export type ArticleSection = {
  id: string;
  title: string;
  body: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  intro: string;
  sections: ArticleSection[];
};

/** All section bodies joined (e.g. paywall preview blur). */
export function flattenArticleBody(article: Article): string {
  return article.sections.map((s) => s.body).join("\n\n");
}

const articles = articlesData as Article[];

export function getAllArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}
