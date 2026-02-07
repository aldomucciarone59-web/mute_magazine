"use client";

import { useState } from "react";

export default function MediaStatsWidget() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div style={widgetStyle}>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18 }}>
                📊 Media Server
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                        Provider: <strong>Cloudinary</strong>
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#666" }}>
                        Upload automatico via next-cloudinary
                    </p>
                </div>

                <div style={{ paddingTop: 8, borderTop: "1px solid #eee" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
                        Piano: <strong>Free</strong>
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#666" }}>
                        25 GB storage + 25 GB bandwidth/mese
                    </p>
                </div>

                {showInfo && (
                    <div style={{
                        marginTop: 8,
                        padding: 12,
                        background: "#f9fafb",
                        borderRadius: 6,
                        fontSize: 13,
                        lineHeight: 1.5,
                    }}>
                        <p style={{ margin: 0, marginBottom: 8 }}>
                            <strong>📁 Organizzazione:</strong>
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li>Tutti i file in cartella "mute-magazine"</li>
                            <li>Upload automatico ottimizzato</li>
                            <li>CDN globale attivo</li>
                        </ul>

                        <p style={{ margin: "12px 0 8px 0" }}>
                            <strong>🔍 Monitora uso:</strong>
                        </p>
                        <a
                            href="https://console.cloudinary.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#0066cc",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            Cloudinary Dashboard →
                        </a>
                    </div>
                )}
            </div>

            <button
                onClick={() => setShowInfo(!showInfo)}
                style={{
                    marginTop: 16,
                    padding: "8px 16px",
                    background: "#f0f0f0",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 14,
                    width: "100%",
                }}
            >
                {showInfo ? "▲ Nascondi info" : "▼ Mostra info"}
            </button>

            <div style={{
                marginTop: 12,
                padding: 8,
                background: "#eff6ff",
                borderRadius: 4,
                fontSize: 12,
                color: "#1e40af",
            }}>
                💡 Per statistiche dettagliate visita la dashboard Cloudinary
            </div>
        </div>
    );
}

const widgetStyle: React.CSSProperties = {
    padding: 20,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
    maxWidth: 400,
};