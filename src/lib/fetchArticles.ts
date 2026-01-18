import { ArticleCard } from "@/data/articles";

export async function fetchArticles(category?: string): Promise<ArticleCard[]> {
    const url = category ? `/api/articles?category=${category}` : `/api/articles`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Errore fetching articles");
    return res.json();
}
