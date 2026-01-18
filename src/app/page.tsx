import Image from "next/image";
import Link from "next/link";

const papere = [
  { slug: "cultura", label: "Cultura", image: "/papera_cultura.png" },
  { slug: "societa", label: "Società", image: "/Papera_società.png" },
  { slug: "riflessioni", label: "Riflessioni", image: "/Papera_riflessioni.png" },
  { slug: "curiosita", label: "Curiosità", image: "/papera_curiosità.png" },
];
const manifestoText = `Caratteristica principale è data dal fatto che offre una distribuzione delle lettere uniforme, apparendo come un normale blocco di testo leggibile. Fu reso popolare, negli anni '60, con la diffusione dei fogli di caramenteo dei L'uso di questo espediente di riempire spazi altrimenti vuoti (spesso in attesa dei dati definitivi), è molto efficace grazie soprattutto all'alternanza di parole lunghe e brevi, punteggiatura e paragrafi. In questo modo viene simulato con sufficiente verosimiglianza l'impatto grafico di un testo reale, in modo particolare per quanto riguarda l'impatto estetico.`;

export default function Home() {
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
                  alt={`Papera ${papera.label}`}
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
              <p>{manifestoText}</p>
              <p>{manifestoText}</p>
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
