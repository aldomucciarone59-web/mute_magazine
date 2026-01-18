"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArticleCard, categoryLabels } from "@/data/articles";

export default function AdminEdit() {
    const { id } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<ArticleCard | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/articles/${id}`)
            .then((res) => res.json())
            .then(setArticle)
            .catch(console.error);
    }, [id]);

    if (!article) return <p style={{ padding: 32 }}>Loading...</p>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());

        await fetch(`/api/articles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        router.push("/admin");
    };

    return (
        <main
            style={{
                padding: "clamp(24px, 6vw, 48px)",
                maxWidth: 720,
                margin: "0 auto",
            }}
        >
            <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", marginBottom: 24 }}>
                Modifica articolo
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(12px, 3vw, 16px)",
                }}
            >
                <input
                    name="title"
                    defaultValue={article.title}
                    placeholder="Titolo"
                    style={inputStyle}
                />
                <input
                    name="subtitle"
                    defaultValue={article.subtitle}
                    placeholder="Sottotitolo"
                    style={inputStyle}
                />
                <input
                    name="author"
                    defaultValue={article.author}
                    placeholder="Autore"
                    style={inputStyle}
                />
                <input
                    name="cover"
                    defaultValue={article.cover}
                    placeholder="Link immagine"
                    style={inputStyle}
                />
                {/* Select per categoria */}
                <select name="category" required style={inputStyle} defaultValue="">
                    <option value="" disabled>Seleziona categoria</option>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
                <textarea
                    name="content"
                    defaultValue={article.content}
                    placeholder="Contenuto"
                    rows={8}
                    style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: 160,
                        maxHeight: 400,
                        overflow: "auto",
                    }}
                />
                <button
                    type="submit"
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
                    onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#333")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#111")
                    }
                >
                    Salva
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
