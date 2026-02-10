"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const papere = [
    { slug: "cultura", label: "Cultura", image: "/papera_cultura.png" },
    { slug: "societa", label: "Società", image: "/papera_societa.png" },
    { slug: "riflessioni", label: "Riflessioni", image: "/papera_riflessioni.png" },
    { slug: "curiosita", label: "Curiosità", image: "/papera_curiosita.png" },
];

export default function PapereGrid() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
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
                {papere.map((papera, index) => (
                    <Link
                        key={papera.slug}
                        href={`/articoli/${papera.slug}`}
                        style={{
                            textAlign: "center",
                            textDecoration: "none",
                            color: "#111",
                            transition: "transform 0.2s ease",
                            transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
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
                                sizes="(max-width: 600px) 50vw, 25vw"
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
    );
}