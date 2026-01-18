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
// DELETE (cancella articolo)
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

        const result = await db.collection("articles").deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Articolo non trovato" }, { status: 404 });
        }

        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Errore deleting articolo" }, { status: 500 });
    }
}
