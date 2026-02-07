import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("mute_magazine");

        // Get database stats
        const dbStats = await db.stats();

        // Count documents in articles collection
        const articlesCount = await db.collection("articles").countDocuments();

        // Format sizes
        const formatBytes = (bytes: number) => {
            if (bytes === 0) return "0 B";
            const k = 1024;
            const sizes = ["B", "KB", "MB", "GB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
        };

        return NextResponse.json({
            collections: dbStats.collections,
            documents: articlesCount,
            dataSize: formatBytes(dbStats.dataSize),
            indexSize: formatBytes(dbStats.indexSize),
            storageSize: formatBytes(dbStats.storageSize),
        });
    } catch (error: any) {
        console.error("MongoDB stats error:", error);
        return NextResponse.json(
            { error: error.message || "Errore nel recupero statistiche" },
            { status: 500 }
        );
    }
}