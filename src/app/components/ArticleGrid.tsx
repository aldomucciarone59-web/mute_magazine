"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link"; // <-- import
import { ArticleCard } from "@/data/articles";
import { fetchArticles } from "@/lib/fetchArticles"

type Props = {
  category: string;
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 0,
  border: "1px solid #dedede",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

export default function ArticleGrid({ category }: Props) {
  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles(category);
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (!articles.length) return <p>Nessun articolo in questa categoria.</p>;

  return (
    <section
      style={{
        padding: "clamp(48px, 12vw, 96px) clamp(16px, 4vw, 40px) clamp(32px, 8vw, 64px)",
        background: "#f8f7f7",
        minHeight: "calc(100vh - clamp(56px, 12vw, 64px))",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100, marginLeft: "auto" }}>
        <header style={{ marginBottom: "clamp(24px, 6vw, 32px)", textAlign: "left" }}>
          <p
            style={{
              letterSpacing: 3,
              fontSize: "clamp(11px, 2.8vw, 14px)",
              textTransform: "uppercase",
              color: "#8d8d8d",
              marginBottom: "clamp(8px, 2vw, 12px)",
            }}
          >
            Archivio articoli
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 7vw, 48px)",
              margin: 0,
              color: "#111",
              lineHeight: 1.1,
            }}
          >
            {category}
          </h1>
        </header>

        <div
          className="article-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            columnGap: 0,
            rowGap: 0,
            width: "100%",
          }}
        >
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/articoli/${article.category}/${article.id}`} // App Router
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article style={cardStyle}>
                <Cover cover={article.cover} title={article.title} />
                <div style={{ padding: "clamp(14px, 3.5vw, 18px) clamp(18px, 4.5vw, 22px) clamp(10px, 2.5vw, 12px)", flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "clamp(18px, 4.5vw, 22px)",
                      margin: "0 0 clamp(4px, 1vw, 6px)",
                      lineHeight: 1.3,
                      color: "#111",
                      fontWeight: 700,
                    }}
                  >
                    {article.title}
                  </h2>
                  <p style={{ margin: 0, color: "#555", fontSize: "clamp(13px, 3.2vw, 15px)" }}>
                    {article.subtitle}
                  </p>
                </div>
                <footer
                  style={{
                    padding: "clamp(8px, 2vw, 10px) clamp(18px, 4.5vw, 22px) clamp(14px, 3.5vw, 18px)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    color: "#6e6e6e",
                  }}
                >
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </footer>
              </article>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}

function Cover({ cover, title }: Pick<ArticleCard, "cover" | "title">) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
      <Image src={cover} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
    </div>
  );
}
