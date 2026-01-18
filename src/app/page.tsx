import { ArticleCard } from "@/data/articles";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

const papere = [
  { slug: "cultura", label: "Cultura", image: "/papera_cultura.png" },
  { slug: "societa", label: "Società", image: "/papera_societa.png" },
  { slug: "riflessioni", label: "Riflessioni", image: "/papera_riflessioni.png" },
  { slug: "curiosita", label: "Curiosità", image: "/papera_curiosita.png" },
];

async function getManifesto(): Promise<ArticleCard | null> {
  try {
    const h = await headers();   // 👈 QUESTO È IL FIX
    const host = h.get("host");

    if (!host) return null;

    const res = await fetch(`http://${host}/api/articles/manifesto`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Manifesto fetch error:", err);
    return null;
  }
}

export default async function Home() {
  const manifesto = await getManifesto();
  return (
    <main style={{ background: "#fff" }}>
      <section
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "clamp(40px, 7vw, 56px)",
          paddingBottom: "clamp(16px, 4vw, 24px)",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
        }}
      >
        <div
          className="papere-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(12px, 3vw, 32px)",
            width: "100%",
            maxWidth: 1100,
          }}
        >
          {papere.map((papera) => (
            <Link
              key={papera.slug}
              href={`/articoli/${papera.slug}`}
              style={{
                textAlign: "center",
                textDecoration: "none",
                color: "#111",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "clamp(120px, 30vw, 200px)",
                  marginBottom: "clamp(4px, 1vw, 8px)",
                }}
              >
                <Image
                  src={papera.image}
                  alt={`papera ${papera.label}`}
                  fill
                  sizes="(max-width: 600px) 25vw, 25vw"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <span style={{ fontSize: "clamp(11px, 2.5vw, 14px)", fontWeight: 600, whiteSpace: "nowrap" }}>
                {papera.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Link
        href="/ultimi-articoli"
        style={{ display: "block", textDecoration: "none" }}
      >
        <div className="ticker">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className={`ticker__track ticker__track--${row}`}
              aria-hidden="true"
            >
              {Array.from({ length: 10 }).map((_, idx) => (
                <span key={`${row}-${idx}`}>ULTIMI ARTICOLI&nbsp;—&nbsp;</span>
              ))}
            </div>
          ))}
        </div>
      </Link>

      <section className="manifesto">
        <div className="manifesto__image">
          <Image
            src="/Screenshot 2025-12-04 alle 11.01.08.png"
            alt="Mute manifesto illustration"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <div className="manifesto__text">
          <div className="manifesto__title">Manifesto</div>
          <div className="manifesto__marquee">
            <div className="manifesto__marquee-inner">
              <p>{manifesto?.content ?? "Manifesto non disponibile"}</p>
              <p>{manifesto?.content ?? "Manifesto non disponibile"}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contatti" className="contacts">
        <div className="contacts__panel">
          <h2>Contatti</h2>
          <p>Instagram: @mutezine</p>
          <p>email: mutemagazine@gmail.com</p>
          <p>ci troviamo a: Milano</p>
        </div>
      </section>
    </main>
  );
}
