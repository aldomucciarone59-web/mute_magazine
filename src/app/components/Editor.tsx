"use client";

import { useEffect, useRef, useState } from "react";

interface EditorProps {
    onChange: (data: any) => void;
    initialData?: any;
    editorKey?: number; // Usa questa prop per forzare re-init
}

// Max 10MB per immagini, 50MB per video
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export default function Editor({ onChange, initialData, editorKey }: EditorProps) {
    const editorRef = useRef<any>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const uploadedMediaRef = useRef<Set<string>>(new Set());
    const isInitializedRef = useRef(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !holderRef.current) return;

        let isSubscribed = true;
        isInitializedRef.current = false;
        setIsReady(false);

        const initEditor = async () => {
            const EditorJS = (await import("@editorjs/editorjs")).default;
            const Header = (await import("@editorjs/header")).default;
            const List = (await import("@editorjs/list")).default;
            const Paragraph = (await import("@editorjs/paragraph")).default;
            const ImageTool = (await import("@editorjs/image")).default;

            // Distruggi editor esistente se presente
            if (editorRef.current) {
                try {
                    await editorRef.current.isReady;
                    editorRef.current.destroy();
                    editorRef.current = null;
                } catch (e) {
                    console.error("Error destroying editor:", e);
                }
            }

            if (!isSubscribed) return;

            // Aspetta un tick per assicurarsi che il DOM sia pulito
            await new Promise(resolve => setTimeout(resolve, 50));

            if (!isSubscribed || !holderRef.current) return;

            const editor = new EditorJS({
                holder: holderRef.current!,
                placeholder: "Inizia a scrivere il tuo articolo...",
                data: initialData || undefined,
                tools: {
                    header: {
                        // @ts-ignore
                        class: Header,
                        config: {
                            placeholder: "Inserisci titolo",
                            levels: [2, 3, 4],
                            defaultLevel: 2,
                        },
                    },
                    paragraph: {
                        // @ts-ignore
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    list: {
                        // @ts-ignore
                        class: List,
                        inlineToolbar: true,
                    },
                    image: {
                        // @ts-ignore
                        class: ImageTool,
                        toolbox: {
                            title: "Img/Video/GIF",
                            icon: `
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M4 4h16v16H4z" fill="none"/>
        <path d="M21 19V5a2 2 0 0 0-2-2H5
                 a2 2 0 0 0-2 2v14
                 a2 2 0 0 0 2 2h14
                 a2 2 0 0 0 2-2z
                 M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    `,
                        },
                        config: {
                            uploader: {
                                uploadByFile(file: File) {
                                    return uploadFile(file, uploadedMediaRef);
                                },
                                uploadByUrl(url: string) {
                                    return Promise.resolve({
                                        success: 1,
                                        file: { url },
                                    });
                                },
                            },
                            types: "image/*, video/*, .gif",
                        },
                    },

                },
                onChange: async () => {
                    if (editorRef.current && isInitializedRef.current) {
                        const data = await editorRef.current.save();
                        onChange(data);
                    }
                },
                onReady: () => {
                    if (isSubscribed) {
                        setIsReady(true);
                        // Aspetta un attimo prima di abilitare onChange
                        setTimeout(() => {
                            isInitializedRef.current = true;
                        }, 100);
                        console.log("✅ Editor ready");
                    }
                },
            });

            if (isSubscribed) {
                editorRef.current = editor;
            }
        };

        initEditor().catch((err) => {
            console.error("Failed to initialize editor:", err);
        });

        return () => {
            isSubscribed = false;
            if (editorRef.current) {
                editorRef.current.isReady
                    .then(() => {
                        editorRef.current?.destroy();
                        editorRef.current = null;
                    })
                    .catch((e: any) => console.error("Editor cleanup error", e));
            }
        };
    }, [isMounted, editorKey]); // Solo isMounted e editorKey, NON initialData!

    if (!isMounted) {
        return (
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: 16,
                    minHeight: 300,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                }}
            >
                Caricamento editor...
            </div>
        );
    }

    return (
        <div>
            <div
                ref={holderRef}
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: 16,
                    minHeight: 300,
                    background: "#fff",
                    opacity: isReady ? 1 : 0.5,
                    transition: "opacity 0.3s",
                }}
            />
            {!isReady && (
                <p style={{ fontSize: 13, color: "#666", marginTop: 8, textAlign: "center" }}>
                    Caricamento contenuto...
                </p>
            )}
        </div>
    );
}

/**
 * Upload file con validazione dimensione
 */
async function uploadFile(file: File, uploadedMediaRef: React.MutableRefObject<Set<string>>) {
    // Validazione dimensione
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
        const sizeMB = (maxSize / 1024 / 1024).toFixed(0);
        alert(`Il file è troppo grande. Max ${sizeMB}MB per ${isVideo ? "video" : "immagini"}.`);
        return {
            success: 0,
            error: `File troppo grande (max ${sizeMB}MB)`,
        };
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const data = await res.json();

        // Traccia il media caricato
        if (data.publicId) {
            uploadedMediaRef.current.add(data.publicId);
        }

        return {
            success: 1,
            file: {
                url: data.url,
                publicId: data.publicId,
                resourceType: data.resourceType,
                ...(file.type.startsWith("video/") && {
                    type: "video",
                    mime: file.type
                }),
                ...(file.type === "image/gif" && {
                    type: "gif"
                }),
            },
        };
    } catch (error) {
        console.error("Upload error:", error);
        return {
            success: 0,
            error: "Upload fallito",
        };
    }
}

/**
 * Utility per cancellare media da Cloudinary
 */
export async function deleteCloudinaryMedia(url: string): Promise<boolean> {
    if (!url || !url.includes("cloudinary")) {
        return false;
    }

    const publicId = extractPublicId(url);
    if (!publicId) {
        console.warn("Could not extract public_id from:", url);
        return false;
    }

    try {
        const resourceType = url.includes("/video/") ? "video" : "image";

        const res = await fetch("/api/media", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId, resourceType }),
        });

        if (res.ok) {
            console.log("✅ Media deleted:", publicId);
            return true;
        } else {
            console.error("❌ Failed to delete media:", await res.text());
            return false;
        }
    } catch (err) {
        console.error("❌ Error deleting media:", err);
        return false;
    }
}

function extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
}