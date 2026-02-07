"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryLabels } from "@/data/articles";
import Editor, { deleteCloudinaryMedia } from "@/app/components/Editor";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export default function AdminNewArticle() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string>("");

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validazione dimensione
        const isVideo = file.type.startsWith("video/");
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

        if (file.size > maxSize) {
            const sizeMB = (maxSize / 1024 / 1024).toFixed(0);
            alert(`Il file è troppo grande. Max ${sizeMB}MB per ${isVideo ? "video" : "immagini"}.`);
            e.target.value = "";
            return;
        }

        // Se c'era già una cover, cancellala da Cloudinary
        if (coverUrl) {
            await deleteCloudinaryMedia(coverUrl);
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
            setCoverUrl(data.url);
        } catch (err: any) {
            console.error(err);
            alert("Errore durante l'upload della copertina");
            setCoverFile(null);
            setCoverPreview(null);
        } finally {
            setUploadingCover(false);
        }
    };

    const handleRemoveCover = async () => {
        if (coverUrl) {
            await deleteCloudinaryMedia(coverUrl);
        }
        setCoverFile(null);
        setCoverPreview(null);
        setCoverUrl("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const form = new FormData(e.currentTarget);

            const payload = {
                title: form.get("title"),
                subtitle: form.get("subtitle"),
                author: form.get("author"),
                category: form.get("category"),
                cover: coverUrl,
                content,
            };

            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Errore durante la creazione");
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
        <main style={{ padding: "clamp(24px, 6vw, 48px)", maxWidth: 720, margin: "0 auto" }}>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", marginBottom: 24 }}>
                Nuovo articolo
            </h1>

            {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
                <input name="title" placeholder="Titolo" required style={inputStyle} />
                <input name="subtitle" placeholder="Sottotitolo" style={inputStyle} />
                <input name="author" placeholder="Autore" required style={inputStyle} />

                <select name="category" required defaultValue="" style={inputStyle}>
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

                    {!coverPreview && (
                        <input
                            type="file"
                            accept="image/*,.gif"
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

                    {coverPreview && !uploadingCover && (
                        <div style={{ marginTop: 12 }}>
                            <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                                Preview copertina:
                            </p>
                            {coverFile?.type.startsWith("video/") ? (
                                <video
                                    src={coverPreview}
                                    controls
                                    style={{
                                        width: "100%",
                                        maxHeight: 300,
                                        borderRadius: 6,
                                    }}
                                />
                            ) : (
                                <img
                                    src={coverPreview}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: 300,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                    }}
                                />
                            )}
                            <button
                                type="button"
                                onClick={handleRemoveCover}
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
                                Rimuovi copertina
                            </button>
                        </div>
                    )}
                </div>

                {/* EditorJS */}
                <div>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>
                        Contenuto articolo (max 10MB immagini, 50MB video)
                    </p>
                    <Editor onChange={setContent} />
                </div>

                <button
                    type="submit"
                    disabled={loading || !content || uploadingCover}
                    style={{
                        padding: "12px 16px",
                        background: loading || !content || uploadingCover ? "#999" : "#111",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: loading || !content || uploadingCover ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    {loading && <div className="spinner" style={smallSpinnerStyle} />}
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
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
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