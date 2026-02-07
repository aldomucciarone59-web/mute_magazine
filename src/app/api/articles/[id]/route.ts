import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// ===================================
// GET articolo singolo
// ===================================
export async function GET(req: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
        return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("mute_magazine");
        const collection = db.collection("articles");

        const article = await collection.findOne({ id });

        if (!article) {
            return NextResponse.json({ error: "Articolo non trovato" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Errore fetching articolo" }, { status: 500 });
    }
}

// ===================================
// PUT (aggiorna articolo)
// ===================================
export async function PUT(req: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
        return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("mute_magazine");
        const data = await req.json();

        const result = await db.collection("articles").updateOne(
            { id },
            { $set: { ...data } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Articolo non trovato" }, { status: 404 });
        }

        return NextResponse.json({ modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Errore updating articolo" }, { status: 500 });
    }
}

// ===================================
// DELETE (cancella articolo + media)
// ===================================
export async function DELETE(req: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
        return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("mute_magazine");

        // 1. Prima recupera l'articolo per ottenere i media
        const article = await db.collection("articles").findOne({ id });

        if (!article) {
            return NextResponse.json({ error: "Articolo non trovato" }, { status: 404 });
        }

        // 2. Estrai e cancella tutti i media
        const mediaUrls = extractMediaUrlsFromArticle(article);
        console.log(`🗑️ Deleting ${mediaUrls.length} media files for article:`, id);

        // Cancella i media in parallelo (non bloccare se fallisce)
        const deletePromises = mediaUrls.map(url => deleteMediaFromCloudinary(url));
        await Promise.allSettled(deletePromises); // allSettled invece di all per non bloccare se uno fallisce

        // 3. Cancella l'articolo dal database
        const result = await db.collection("articles").deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Errore cancellazione articolo" }, { status: 500 });
        }

        console.log(`✅ Article deleted:`, id);

        return NextResponse.json({
            deletedCount: result.deletedCount,
            mediaDeleted: mediaUrls.length
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Errore deleting articolo" }, { status: 500 });
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Estrae tutti gli URL dei media da un articolo
 */
function extractMediaUrlsFromArticle(article: any): string[] {
    const urls: string[] = [];

    // 1. Cover image/video
    if (article.cover && article.cover.includes("cloudinary")) {
        urls.push(article.cover);
    }

    // 2. Media dentro il content (EditorJS)
    if (article.content) {
        try {
            let content;
            if (typeof article.content === "string") {
                content = JSON.parse(article.content);
            } else {
                content = article.content;
            }

            // Cerca tutti i blocchi di tipo "image" (include anche video e gif)
            if (content.blocks && Array.isArray(content.blocks)) {
                content.blocks.forEach((block: any) => {
                    if (block.type === "image" && block.data?.file?.url) {
                        const url = block.data.file.url;
                        if (url.includes("cloudinary")) {
                            urls.push(url);
                        }
                    }
                });
            }
        } catch (e) {
            console.error("Error parsing content for media extraction:", e);
        }
    }

    return urls;
}

/**
 * Cancella un media da Cloudinary
 */
async function deleteMediaFromCloudinary(url: string): Promise<boolean> {
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

        // Usa l'API di base dell'app (non fetch esterno)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/media`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId, resourceType }),
        });

        if (res.ok) {
            console.log("✅ Media deleted:", publicId);
            return true;
        } else {
            console.error("❌ Failed to delete media:", publicId);
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