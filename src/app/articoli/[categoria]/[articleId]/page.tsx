"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleCard } from "@/data/articles";

export default function ArticoloDettaglio() {
  const { articleId } = useParams(); // questo è l'UUID dell'articolo
  const [article, setArticle] = useState<ArticleCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${articleId}`);
        if (!res.ok) throw new Error("Articolo non trovato");
        const data: ArticleCard = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Articolo non trovato</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>{article.title}</h1>
      <p style={{ fontStyle: "italic", color: "#555" }}>{article.subtitle}</p>
      <p>Autore: {article.author}</p>
      <p>Data: {article.date}</p>
      {article.cover && (
        <img
          src={article.cover}
          alt={article.title}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover", marginBottom: 24 }}
        />
      )}
      <article dangerouslySetInnerHTML={{ __html: article.content || "" }} />
    </main>
  );
}
