"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArticleCard } from "@/data/articles";
import EditorRenderer from "@/app/components/EditorRenderer";

export default function ArticoloDettaglio() {
  const { articleId } = useParams();
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

  if (loading) {
    return (
      <div style={{
        padding: "clamp(48px, 12vw, 96px) clamp(16px, 4vw, 40px)",
        textAlign: "center"
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{
        padding: "clamp(48px, 12vw, 96px) clamp(16px, 4vw, 40px)",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)" }}>
          Articolo non trovato
        </h1>
      </div>
    );
  }

  return (
    <main
      style={{
        padding: "clamp(48px, 12vw, 96px) clamp(16px, 4vw, 40px) clamp(60px, 15vw, 120px)",
        background: "#fdfdfd",
        minHeight: "calc(100vh - clamp(56px, 12vw, 64px))",
      }}
    >
      <article style={{ maxWidth: 840, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: "clamp(32px, 8vw, 48px)", textAlign: "center" }}>
          <p
            style={{
              fontSize: "clamp(12px, 3vw, 14px)",
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#999",
              marginBottom: 12,
            }}
          >
            {article.category}
          </p>

          <h1
            style={{
              fontSize: "clamp(32px, 8vw, 56px)",
              lineHeight: 1.2,
              marginBottom: "clamp(12px, 3vw, 16px)",
              color: "#111",
            }}
          >
            {article.title}
          </h1>

          {article.subtitle && (
            <p
              style={{
                fontSize: "clamp(16px, 4vw, 20px)",
                color: "#555",
                fontStyle: "italic",
                marginBottom: "clamp(20px, 5vw, 28px)",
              }}
            >
              {article.subtitle}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(16px, 4vw, 24px)",
              fontSize: "clamp(13px, 3.5vw, 15px)",
              color: "#666",
              flexWrap: "wrap",
            }}
          >
            <span>
              <strong>Autore:</strong> {article.author}
            </span>
            <span>•</span>
            <span>
              {new Date(article.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              marginBottom: "clamp(32px, 8vw, 48px)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Image
              src={article.cover}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 840px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {/* Content - EditorJS Renderer */}
        <EditorRenderer data={article.content} />
      </article>
    </main>
  );
}