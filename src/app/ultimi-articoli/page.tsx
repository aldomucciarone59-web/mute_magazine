import Image from "next/image";
import { articlesByCategory } from "@/data/articles";

const latestArticles = Object.entries(articlesByCategory)
  .flatMap(([category, items]) =>
    items.map((article) => ({ ...article, category }))
  )
  .slice(0, 8);

export default function UltimiArticoli() {
  return (
    <main
      style={{
        padding: "clamp(48px, 12vw, 96px) clamp(16px, 4vw, 40px) clamp(60px, 15vw, 120px)",
        background: "#fdfdfd",
        minHeight: "calc(100vh - clamp(56px, 12vw, 64px))",
      }}
    >
      <header style={{ marginBottom: "clamp(32px, 8vw, 48px)" }}>
        <p
          style={{
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#7a7a7a",
            marginBottom: "clamp(8px, 2vw, 10px)",
            fontSize: "clamp(11px, 2.8vw, 14px)",
          }}
        >
          Ultime pubblicazioni
        </p>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 56px)", margin: 0 }}>
          Ultimi articoli
        </h1>
      </header>

      <div style={{ width: "100%", maxWidth: "min(640px, 90vw)", marginInline: "auto" }}>
        {latestArticles.map((article, idx) => (
          <article
            key={article.id}
            style={{
              border: "1px solid #dedede",
              borderRadius: 0,
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              minHeight: "clamp(320px, 80vw, 420px)",
              marginBottom: idx === latestArticles.length - 1 ? 0 : "clamp(16px, 4vw, 24px)",
            }}
          >
            <div style={{ textAlign: "center", padding: "clamp(8px, 2vw, 10px) 0", fontSize: "clamp(12px, 3vw, 14px)", textTransform: "lowercase" }}>
              {article.category}
            </div>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
              <Image
                src={article.cover}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                padding: "clamp(20px, 5vw, 28px) clamp(18px, 4.5vw, 24px) clamp(24px, 6vw, 34px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px, 2vw, 12px)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "clamp(22px, 5.5vw, 28px)", lineHeight: 1.3 }}>
                {article.title}
              </h2>
              <p style={{ margin: 0, color: "#555", fontSize: "clamp(14px, 3.5vw, 16px)" }}>
                {article.subtitle}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "clamp(11px, 2.8vw, 12px)",
                  color: "#666",
                  textTransform: "lowercase",
                }}
              >
                <span>{article.date}</span>
                <span>{article.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

