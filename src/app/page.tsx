import { ArticleCard } from "@/data/articles";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import PapereGrid from "./components/PapereGrid";

async function getManifesto(): Promise<ArticleCard | null> {
  try {
    const h = await headers();
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
      {/* Papere Grid */}
      <PapereGrid />

      {/* Ticker */}
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

      {/* Manifesto */}
      <section className="manifesto">
        <div className="manifesto__title">Manifesto</div>

        <div className="manifesto__container">
          <div className="manifesto__content">
            <div className="manifesto__marquee">
              <div className="manifesto__marquee-inner">
                <p>{manifesto?.content ?? "Manifesto non disponibile"}</p>
                <p>{manifesto?.content ?? "Manifesto non disponibile"}</p>
              </div>
            </div>
          </div>

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
        </div>
      </section>
    </main>
  );
}