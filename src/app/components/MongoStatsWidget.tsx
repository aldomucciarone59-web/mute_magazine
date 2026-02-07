"use client";

import { useEffect, useState } from "react";

interface MongoStats {
    collections: number;
    documents: number;
    dataSize: string;
    indexSize: string;
    storageSize: string;
}

export default function MongoStatsWidget() {
    const [stats, setStats] = useState<MongoStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/db-stats");
            if (!res.ok) throw new Error("Errore nel recupero statistiche");
            const data = await res.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={widgetStyle}>
                <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18 }}>
                    🍃 Database MongoDB
                </h3>
                <p style={{ color: "#999", margin: 0 }}>Caricamento...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={widgetStyle}>
                <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18 }}>
                    🍃 Database MongoDB
                </h3>
                <p style={{ color: "#dc2626", margin: 0 }}>⚠️ {error}</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div style={widgetStyle}>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18 }}>
                🍃 Database MongoDB
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <StatItem label="Collections" value={stats.collections.toString()} />
                <StatItem label="Documenti totali" value={stats.documents.toString()} />
                <StatItem label="Dimensione dati" value={stats.dataSize} />
                <StatItem label="Dimensione indici" value={stats.indexSize} />
                <StatItem label="Storage totale" value={stats.storageSize} />

                <div style={{ paddingTop: 8, borderTop: "1px solid #eee" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                        Piano: <strong>Free (M0)</strong>
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#999" }}>
                        Limite: 512 MB storage
                    </p>
                </div>
            </div>

            <button
                onClick={fetchStats}
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
                🔄 Aggiorna
            </button>

            <a
                href="https://cloud.mongodb.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    marginTop: 12,
                    display: "block",
                    textAlign: "center",
                    color: "#0066cc",
                    textDecoration: "none",
                    fontSize: 13,
                }}
            >
                Atlas Dashboard →
            </a>
        </div>
    );
}

function StatItem({ label, value }: { label: string; value: string }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0",
        }}>
            <span style={{ fontSize: 14, color: "#666" }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{value}</span>
        </div>
    );
}

const widgetStyle: React.CSSProperties = {
    padding: 20,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
};