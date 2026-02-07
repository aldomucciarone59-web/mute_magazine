/**
 * Utility per estrarre tutti gli URL dei media da un articolo
 */
export function extractMediaUrlsFromArticle(article: any): string[] {
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

/**
 * Cancella tutti i media di un articolo da Cloudinary
 */
export async function deleteArticleMedia(article: any): Promise<void> {
    const mediaUrls = extractMediaUrlsFromArticle(article);

    console.log(`🗑️ Deleting ${mediaUrls.length} media files from article:`, article.id);

    // Cancella tutti i media in parallelo
    const deletePromises = mediaUrls.map(url => deleteCloudinaryMedia(url));
    await Promise.all(deletePromises);

    console.log(`✅ All media deleted for article:`, article.id);
}