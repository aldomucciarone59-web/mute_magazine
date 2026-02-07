"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArticleCard, categoryLabels } from "@/data/articles";
import { fetchArticles } from "@/lib/fetchArticles";
import MediaStatsWidget from "@/app/components/MediaStatsWidget";
import MongoStatsWidget from "@/app/components/MongoStatsWidget";

type CategoryPanelState = Record<string, boolean>;

export default function AdminDashboard() {
    const [manifesto, setManifesto] = useState<ArticleCard | null>(null);
    const [editingManifesto, setEditingManifesto] = useState(false);
    const [manifestoDraft, setManifestoDraft] = useState("");
    const [savingManifesto, setSavingManifesto] = useState(false);

    const [articles, setArticles] = useState<ArticleCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPanels, setExpandedPanels] = useState<CategoryPanelState>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Sezione Dev Stats
    const [showDevStats, setShowDevStats] = useState(false);

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

    const handleDelete = async (article: ArticleCard) => {
        const confirmed = confirm(
            `Sei sicuro di voler eliminare "${article.title}"?\n\n` +
            `Verranno cancellati anche tutti i media associati (cover + immagini/video nell'articolo).`
        );

        if (!confirmed) return;

        setDeletingId(article.id);

        try {
            const res = await fetch(`/api/articles/${article.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Errore durante l'eliminazione");
            }

            const result = await res.json();
            console.log(`✅ Article deleted. Media files deleted: ${result.mediaDeleted || 0}`);

            // Rimuovi l'articolo dalla lista
            setArticles((prev) => prev.filter((a) => a.id !== article.id));

            alert(`Articolo eliminato con successo!\nMedia cancellati: ${result.mediaDeleted || 0}`);
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Errore durante l'eliminazione");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "clamp(48px, 12vw, 96px)", textAlign: "center" }}>
                <div className="spinner" style={spinnerStyle} />
                <p style={{ marginTop: 16, color: "#666" }}>Caricamento dashboard...</p>
            </div>
        );
    }

    return (
        <main style={{ padding: "clamp(24px, 6vw, 48px)", maxWidth: 1200, margin: "0 auto" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 32,
                    flexWrap: "wrap",
                    gap: 16,
                }}
            >
                <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", margin: 0 }}>
                    Gestione articoli
                </h1>

                <Link
                    href="/admin/nuovo"
                    style={{
                        background: "#111",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 6,
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    + Nuovo Articolo
                </Link>
            </div>

            {/* Manifesto */}
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 20,
                    background: "#fafafa",
                    marginBottom: 24,
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
                    <h2 style={{ fontSize: 18, margin: 0, fontWeight: 600 }}>
                        📜 Manifesto
                    </h2>

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
                            {savingManifesto ? "⏳" : "💾"}
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
                        fontFamily: "inherit",
                    }}
                />
            </div>

            {/* Dev Stats - Collapsible */}
            <div
                style={{
                    marginBottom: 24,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#f9f9f9",
                }}
            >
                <button
                    onClick={() => setShowDevStats(!showDevStats)}
                    style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 18px",
                        fontSize: 14,
                        fontWeight: 600,
                        background: "#f9f9f9",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#666",
                    }}
                >
                    <span>🛠️ Developer Stats</span>
                    <span style={{ fontSize: 12 }}>{showDevStats ? "▲" : "▼"}</span>
                </button>

                {showDevStats && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 16,
                            padding: 16,
                            background: "#fff",
                        }}
                    >
                        <MediaStatsWidget />
                        <MongoStatsWidget />
                    </div>
                )}
            </div>

            {/* Accordion categorie */}
            <div>
                <h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>
                    📚 Articoli per categoria
                </h2>

                {Object.keys(categoryLabels).map((cat) => {
                    const catArticles = articles.filter((a) => a.category === cat);
                    const isOpen = expandedPanels[cat];

                    return (
                        <div
                            key={cat}
                            style={{
                                marginBottom: 16,
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                overflow: "hidden",
                                transition: "all 0.2s",
                            }}
                        >
                            <button
                                onClick={() => togglePanel(cat)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "14px 18px",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    fontWeight: 600,
                                    background: isOpen ? "#f0f0f0" : "#f8f8f8",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span>
                                    {categoryLabels[cat]}
                                    <span
                                        style={{
                                            marginLeft: 8,
                                            fontWeight: 500,
                                            color: "#666",
                                            fontSize: "0.9em",
                                        }}
                                    >
                                        ({catArticles.length})
                                    </span>
                                </span>
                                <span style={{ fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                            </button>

                            {isOpen && (
                                <div style={{ overflowX: "auto" }}>
                                    {catArticles.length === 0 ? (
                                        <p
                                            style={{
                                                padding: "20px",
                                                textAlign: "center",
                                                color: "#999",
                                                margin: 0,
                                            }}
                                        >
                                            Nessun articolo in questa categoria
                                        </p>
                                    ) : (
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                minWidth: 500,
                                            }}
                                        >
                                            <thead>
                                                <tr
                                                    style={{
                                                        borderBottom: "2px solid #ddd",
                                                        background: "#fafafa",
                                                    }}
                                                >
                                                    <th style={thStyle}>Titolo</th>
                                                    <th style={thStyle}>Autore</th>
                                                    <th style={thStyle}>Data</th>
                                                    <th style={thStyle}>Azioni</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {catArticles.map((a) => {
                                                    const isDeleting = deletingId === a.id;

                                                    return (
                                                        <tr
                                                            key={a.id}
                                                            style={{
                                                                borderBottom: "1px solid #eee",
                                                                transition: "background 0.2s, opacity 0.3s",
                                                                opacity: isDeleting ? 0.5 : 1,
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (!isDeleting) {
                                                                    e.currentTarget.style.background = "#f9f9f9";
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = "transparent";
                                                            }}
                                                        >
                                                            <td style={tdStyle}>
                                                                <strong>{a.title}</strong>
                                                            </td>
                                                            <td style={tdStyle}>{a.author}</td>
                                                            <td style={tdStyle}>
                                                                {new Date(a.date).toLocaleDateString("it-IT")}
                                                            </td>
                                                            <td style={tdStyle}>
                                                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                                    <Link
                                                                        href={`/admin/${a.id}`}
                                                                        style={{
                                                                            color: "#0066cc",
                                                                            textDecoration: "none",
                                                                            fontWeight: 500,
                                                                            fontSize: "clamp(12px, 3vw, 14px)",
                                                                        }}
                                                                    >
                                                                        ✏️ Modifica
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(a)}
                                                                        disabled={isDeleting}
                                                                        style={{
                                                                            color: isDeleting ? "#999" : "#dc2626",
                                                                            cursor: isDeleting ? "not-allowed" : "pointer",
                                                                            border: "none",
                                                                            background: "none",
                                                                            padding: 0,
                                                                            fontWeight: 500,
                                                                            fontSize: "clamp(12px, 3vw, 14px)",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: 4,
                                                                        }}
                                                                    >
                                                                        {isDeleting && (
                                                                            <div className="spinner" style={tinySpinnerStyle} />
                                                                        )}
                                                                        {isDeleting ? "Eliminando..." : "🗑️ Elimina"}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

const spinnerStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #111",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
};

const tinySpinnerStyle: React.CSSProperties = {
    width: 12,
    height: 12,
    border: "2px solid #dc2626",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
};

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "clamp(13px, 3vw, 14px)",
    fontWeight: 600,
    color: "#555",
};

const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: "clamp(13px, 3vw, 14px)",
    wordBreak: "break-word",
};

const iconButtonStyle: React.CSSProperties = {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 20,
    lineHeight: 1,
    padding: 4,
};