"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryLabels } from "@/data/articles";

export default function AdminNewArticle() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const form = new FormData(e.currentTarget);
            const payload = Object.fromEntries(form.entries());

            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Errore durante la creazione");
            }

            router.push("/admin");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Errore sconosciuto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ padding: "clamp(24px, 6vw, 48px)", maxWidth: 600, margin: "0 auto" }}>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", marginBottom: 24 }}>Nuovo articolo</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 3vw, 16px)" }}
            >
                <input name="title" placeholder="Titolo" required style={inputStyle} />
                <input name="subtitle" placeholder="Sottotitolo" style={inputStyle} />
                <input name="author" placeholder="Autore" required style={inputStyle} />
                <input name="cover" placeholder="Link immagine" style={inputStyle} />

                {/* Select per categoria */}
                <select name="category" required style={inputStyle} defaultValue="">
                    <option value="" disabled>Seleziona categoria</option>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                <textarea
                    name="content"
                    placeholder="Contenuto"
                    rows={8}
                    required
                    style={{ ...inputStyle, resize: "vertical", minHeight: 160, maxHeight: 400, overflow: "auto" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "12px 16px",
                        background: "#111",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#111")}
                >
                    {loading ? "Creando..." : "Crea Articolo"}
                </button>
            </form>
        </main>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: "clamp(14px, 3vw, 16px)",
    outline: "none",
    boxSizing: "border-box",
};
