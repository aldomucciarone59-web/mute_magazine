import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/media
 * Cancella file da Cloudinary
 * Body: { publicId: string, resourceType: "image" | "video" }
 */
export async function DELETE(req: NextRequest) {
    try {
        const { publicId, resourceType } = await req.json();

        if (!publicId) {
            return NextResponse.json(
                { error: "publicId mancante" },
                { status: 400 }
            );
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.warn("⚠️ Cloudinary credentials mancanti - skipping deletion");
            return NextResponse.json({
                success: false,
                message: "Credenziali Cloudinary mancanti"
            });
        }

        // Genera signature per la deletion
        const timestamp = Math.round(new Date().getTime() / 1000);
        const crypto = require("crypto");

        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto
            .createHash("sha1")
            .update(stringToSign)
            .digest("hex");

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType || "image"}/destroy`;

        const formData = new FormData();
        formData.append("public_id", publicId);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", apiKey);
        formData.append("signature", signature);

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.result === "ok" || result.result === "not found") {
            return NextResponse.json({
                success: true,
                result: result.result
            });
        }

        return NextResponse.json({
            success: false,
            error: result.error?.message || "Deletion failed"
        }, { status: 400 });

    } catch (error: any) {
        console.error("DELETE /api/media error:", error);
        return NextResponse.json(
            { error: error.message || "Errore durante la cancellazione" },
            { status: 500 }
        );
    }
}