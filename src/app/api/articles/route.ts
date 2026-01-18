import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("mute_magazine"); // il tuo DB
    const collection = db.collection("articles");

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // ?category=societa

    const query = category ? { category } : {};
    const articles = await collection.find(query).toArray();

    return NextResponse.json(articles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore fetching articles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const client = await clientPromise;
    const db = client.db("mute_magazine");

    const data = await req.json();
    const newArticle = {
        id: uuidv4(),
        title: data.title ?? "",
        subtitle: data.subtitle ?? "",
        author: data.author ?? "",
        date: data.date ?? new Date().toISOString().split("T")[0],
        cover: data.cover ?? "",
        category: data.category ?? "uncategorized",
        content: data.content ?? "",
    };

    const result = await db.collection("articles").insertOne(newArticle);
    return NextResponse.json({ insertedId: result.insertedId });
}
