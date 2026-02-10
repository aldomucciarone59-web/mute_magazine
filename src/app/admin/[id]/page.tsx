"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArticleCard, categoryLabels } from "@/data/articles";
import Editor, { deleteCloudinaryMedia } from "@/app/components/Editor";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export default function AdminEdit() {
    const { id } = useParams();
    const router = useRouter();

    const [article, setArticle] = useState<ArticleCard | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [content, setContent] = useState<any>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [oldCoverUrl, setOldCoverUrl] = useState<string>("");
    const [newCoverUrl, setNewCoverUrl] = useState<string>("");
    const [isLoadingArticle, setIsLoadingArticle] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadArticle = async () => {
            setIsLoadingArticle(true);
            try {
                const res = await fetch(`/api/articles/${id}`);
                if (!res.ok) throw new Error("Articolo non trovato");
                const data: ArticleCard = await res.json();

                console.log("📄 Article loaded:", data);

                setArticle(data);
                setOldCoverUrl(data.cover || "");

                // Parse content
                if (data.content) {
                    try {
                        let parsed;
                        if (typeof data.content === "string") {
                            parsed = JSON.parse(data.content);
                        } else {
                            parsed = data.content;
                        }

                        console.log("📝 Content parsed:", parsed);

                        setContent(parsed);
                        setEditorKey(prev => prev + 1);
                    } catch (e) {
                        console.error("Error parsing content:", e);
                        setContent({ blocks: [] });
                        setEditorKey(prev => prev + 1);
                    }
                } else {
                    setContent({ blocks: [] });
                    setEditorKey(prev => prev + 1);
                }
            } catch (err) {
                console.error(err);
                alert("Errore durante il caricamento dell'articolo");
            } finally {
                setIsLoadingArticle(false);
            }
        };

        loadArticle();
    }, [id]);

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validazione tipo file
        if (!file.type.startsWith("image/")) {
            alert("Solo immagini e GIF sono supportate per la copertina.");
            e.target.value = "";
            return;
        }

        // Validazione dimensione
        if (file.size > MAX_IMAGE_SIZE) {
            alert(`Il file è troppo grande. Max 10MB per le copertine.`);
            e.target.value = "";
            return;
        }

        // Se c'era già una nuova cover (non ancora salvata), cancellala
        if (newCoverUrl) {
            await deleteCloudinaryMedia(newCoverUrl);
        }

        setCoverFile(file);

        // Preview locale
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload immediato
        setUploadingCover(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Errore upload copertina");

            const data = await res.json();
            setNewCoverUrl(data.url);
        } catch (err: any) {
            console.error(err);
            alert("Errore durante l'upload della copertina");
            setCoverFile(null);
            setCoverPreview(null);
        } finally {
            setUploadingCover(false);
        }
    };

    const handleRemoveNewCover = async () => {
        if (newCoverUrl) {
            await deleteCloudinaryMedia(newCoverUrl);
        }
        setCoverFile(null);
        setCoverPreview(null);
        setNewCoverUrl("");
    };

    const handleContentChange = (newContent: any) => {
        console.log("📝 Content updated:", newContent);
        setContent(newContent);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData(e.currentTarget);

            // Determina quale cover usare
            let finalCoverUrl = oldCoverUrl;

            if (newCoverUrl) {
                // C'è una nuova cover, cancella la vecchia
                if (oldCoverUrl && oldCoverUrl !== newCoverUrl) {
                    await deleteCloudinaryMedia(oldCoverUrl);
                }
                finalCoverUrl = newCoverUrl;
            }

            const payload = {
                title: form.get("title"),
                subtitle: form.get("subtitle"),
                author: form.get("author"),
                category: form.get("category"),
                cover: finalCoverUrl,
                content: content,
            };

            console.log("💾 Saving article:", payload);

            const res = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Errore aggiornamento articolo");

            router.push("/admin");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Errore durante il salvataggio");
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingArticle) {
        return (
            <div style={{ padding: "clamp(48px, 12vw, 96px)", textAlign: "center" }}>
                <div className="spinner" style={bigSpinnerStyle} />
                <p style={{ marginTop: 16, color: "#666" }}>Caricamento articolo...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <p style={{ padding: 32, textAlign: "center" }}>
                Articolo non trovato
            </p>
        );
    }

    const currentCoverUrl = newCoverUrl || oldCoverUrl;

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
                    gap: 16,
                }}
            >
                <input
                    name="title"
                    defaultValue={article.title}
                    placeholder="Titolo"
                    required
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
                    required
                    style={inputStyle}
                />

                <select
                    name="category"
                    required
                    defaultValue={article.category}
                    style={inputStyle}
                >
                    <option value="" disabled>
                        Seleziona categoria
                    </option>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>

                {/* Cover upload */}
                <div>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                        Immagine/GIF copertina (max 10MB)
                    </label>

                    {/* Current cover */}
                    {currentCoverUrl && !coverPreview && (
                        <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                                Copertina attuale:
                            </p>
                            <img
                                src={currentCoverUrl}
                                alt="Current cover"
                                style={{
                                    width: "100%",
                                    maxHeight: 200,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                }}
                            />
                        </div>
                    )}

                    {!coverPreview && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            disabled={uploadingCover}
                            style={inputStyle}
                        />
                    )}

                    {uploadingCover && (
                        <div style={{ padding: 16, textAlign: "center" }}>
                            <div className="spinner" style={spinnerStyle} />
                            <p style={{ marginTop: 8, color: "#666" }}>Upload in corso...</p>
                        </div>
                    )}

                    {/* New preview */}
                    {coverPreview && !uploadingCover && (
                        <div style={{ marginTop: 12 }}>
                            <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                                Nuova copertina:
                            </p>
                            <img
                                src={coverPreview}
                                alt="New preview"
                                style={{
                                    width: "100%",
                                    maxHeight: 200,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveNewCover}
                                style={{
                                    marginTop: 8,
                                    padding: "6px 12px",
                                    background: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    fontSize: 14,
                                }}
                            >
                                Rimuovi nuova copertina
                            </button>
                        </div>
                    )}
                </div>

                {/* EditorJS */}
                <div>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>
                        Contenuto articolo (max 10MB immagini, 50MB video)
                    </p>
                    {content !== null && (
                        <Editor
                            key={editorKey}
                            editorKey={editorKey}
                            onChange={handleContentChange}
                            initialData={content}
                        />
                    )}
                    {content === null && (
                        <div style={{
                            padding: 40,
                            textAlign: "center",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            background: "#f9f9f9"
                        }}>
                            <p style={{ color: "#666" }}>Caricamento contenuto...</p>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || uploadingCover || content === null}
                    style={{
                        padding: "12px 16px",
                        background: loading || uploadingCover || content === null ? "#999" : "#111",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: loading || uploadingCover || content === null ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    {loading && <div className="spinner" style={smallSpinnerStyle} />}
                    {loading ? "Salvando..." : "Salva Modifiche"}
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
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
};

const bigSpinnerStyle: React.CSSProperties = {
    width: 60,
    height: 60,
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #111",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
};

const spinnerStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #111",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
};

const smallSpinnerStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    border: "2px solid #fff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
};