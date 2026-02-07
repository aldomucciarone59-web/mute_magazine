import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/upload
 * Upload file to Cloudinary using next-cloudinary
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Nessun file fornito" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");

        // Determine resource type
        const fileType = file.type;
        let resourceType: "image" | "video" | "raw" = "image";

        if (fileType.startsWith("video/")) {
            resourceType = "video";
        } else if (fileType === "image/gif") {
            resourceType = "image";
        } else if (!fileType.startsWith("image/")) {
            resourceType = "raw";
        }

        // Upload to Cloudinary via their API
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

        const cloudinaryData = new FormData();
        cloudinaryData.append("file", `data:${file.type};base64,${base64}`);
        cloudinaryData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
        cloudinaryData.append("folder", "mute-magazine");

        const uploadResponse = await fetch(cloudinaryUrl, {
            method: "POST",
            body: cloudinaryData,
        });

        if (!uploadResponse.ok) {
            const error = await uploadResponse.text();
            console.error("Cloudinary error:", error);
            throw new Error("Cloudinary upload failed");
        }

        const result = await uploadResponse.json();

        // Return the public URL
        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Errore durante l'upload" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/upload
 * Get usage stats (optional - for monitoring)
 */
export async function GET() {
    try {
        // For stats, you'd need the Admin API
        // With next-cloudinary and unsigned uploads, this is limited
        // You can implement this later if needed
        return NextResponse.json({
            message: "Stats endpoint - implement if needed",
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}