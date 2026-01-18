"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleCard, categoryLabels } from "@/data/articles";
import { fetchArticles } from "@/lib/fetchArticles";

type CategoryPanelState = Record<string, boolean>;

export default function AdminDashboard() {
    const [manifesto, setManifesto] = useState<ArticleCard | null>(null);
    const [editingManifesto, setEditingManifesto] = useState(false);
    const [manifestoDraft, setManifestoDraft] = useState("");
    const [savingManifesto, setSavingManifesto] = useState(false);

    const [articles, setArticles] = useState<ArticleCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPanels, setExpandedPanels] = useState<CategoryPanelState>({});

    // Inizializza tutti i pannelli chiusi
    useEffect(() => {
        const initPanels: CategoryPanelState = {};
        Object.keys(categoryLabels).forEach((c) => (initPanels[c] = false));
        setExpandedPanels(initPanels);
    }, []);

    // Carica articoli
    useEffect(() => {
        const load = async () => {
            try {
                const cats = Object.keys(categoryLabels);
                const all: ArticleCard[] = [];
                for (const c of cats) {
                    const data = await fetchArticles(c);
                    all.push(...data.map((a) => ({ ...a, category: c })));
                }
                setArticles(all);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const loadManifesto = async () => {
            try {
                const res = await fetch("/api/articles/manifesto");
                if (!res.ok) return;
                const data: ArticleCard = await res.json();
                setManifesto(data);
                setManifestoDraft(data.content || "");
            } catch (err) {
                console.error("Errore caricamento manifesto", err);
            }
        };

        loadManifesto();
    }, []);


    if (loading) return <p style={{ padding: 32 }}>Loading...</p>;

    const togglePanel = (cat: string) =>
        setExpandedPanels((prev) => ({ ...prev, [cat]: !prev[cat] }));

    const saveManifesto = async () => {
        if (!manifesto) return;

        try {
            setSavingManifesto(true);
            await fetch("/api/articles/manifesto", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: manifestoDraft,
                }),
            });

            setManifesto({ ...manifesto, content: manifestoDraft });
            setEditingManifesto(false);
        } catch (err) {
            console.error("Errore salvataggio manifesto", err);
            alert("Errore durante il salvataggio");
        } finally {
            setSavingManifesto(false);
        }
    };


    return (
        <main style={{ padding: "clamp(24px, 6vw, 48px)", maxWidth: 800, margin: "0 auto" }}>
            {/* Manifesto */}
            <div
                style={{
                    marginBottom: 32,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: 16,
                    background: "#fafafa",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <h2 style={{ fontSize: 18, margin: 0 }}>Manifesto</h2>

                    {!editingManifesto ? (
                        <button
                            onClick={() => setEditingManifesto(true)}
                            style={iconButtonStyle}
                            title="Modifica manifesto"
                        >
                            ✏️
                        </button>
                    ) : (
                        <button
                            onClick={saveManifesto}
                            disabled={savingManifesto}
                            style={iconButtonStyle}
                            title="Salva manifesto"
                        >
                            💾
                        </button>
                    )}
                </div>

                <textarea
                    value={editingManifesto ? manifestoDraft : manifesto?.content || ""}
                    onChange={(e) => setManifestoDraft(e.target.value)}
                    readOnly={!editingManifesto}
                    rows={6}
                    style={{
                        width: "100%",
                        resize: "vertical",
                        padding: 12,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        fontSize: 14,
                        background: editingManifesto ? "#fff" : "#f5f5f5",
                    }}
                />
            </div>

            <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", marginBottom: 24 }}>Gestione articoli</h1>

            <Link
                href="/admin/nuovo"
                style={{
                    marginBottom: 16,
                    display: "inline-block",
                    background: "#111",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 6,
                }}
            >
                Aggiungi Articolo
            </Link>

            {/* Accordion per categorie */}
            {Object.keys(categoryLabels).map((cat) => {
                const catArticles = articles.filter((a) => a.category === cat);
                const isOpen = expandedPanels[cat];

                return (
                    <div
                        key={cat}
                        style={{
                            marginBottom: "16px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            overflow: "hidden",
                        }}
                    >
                        <button
                            onClick={() => togglePanel(cat)}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "12px 16px",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                fontWeight: 600,
                                background: "#f8f8f8",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {categoryLabels[cat]} ({catArticles.length}) {isOpen ? "▲" : "▼"}
                        </button>

                        {isOpen && (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid #ddd" }}>
                                            <th style={thStyle}>Titolo</th>
                                            <th style={thStyle}>Autore</th>
                                            <th style={thStyle}>Data</th>
                                            <th style={thStyle}>Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {catArticles.map((a) => (
                                            <tr key={a.id} style={{ borderBottom: "1px solid #ddd" }}>
                                                <td style={tdStyle}>{a.title}</td>
                                                <td style={tdStyle}>{a.author}</td>
                                                <td style={tdStyle}>{a.date}</td>
                                                <td style={tdStyle}>
                                                    <Link
                                                        href={`/admin/${a.id}`}
                                                        style={{ marginRight: 8, color: "#111", textDecoration: "underline" }}
                                                    >
                                                        Modifica
                                                    </Link>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm("Vuoi cancellare questo articolo?")) return;
                                                            await fetch(`/api/articles/${a.id}`, { method: "DELETE" });
                                                            setArticles((prev) => prev.filter((x) => x.id !== a.id));
                                                        }}
                                                        style={{
                                                            color: "red",
                                                            cursor: "pointer",
                                                            border: "none",
                                                            background: "none",
                                                            padding: 0,
                                                            marginLeft: 8,
                                                        }}
                                                    >
                                                        Elimina
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </main>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "8px 12px",
    fontSize: "clamp(13px, 3vw, 16px)",
    fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: "clamp(13px, 3vw, 15px)",
    wordBreak: "break-word",
};

const iconButtonStyle: React.CSSProperties = {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
};

