"use client";

import React from "react";

interface EditorJSData {
    time?: number;
    blocks: Array<{
        type: string;
        data: any;
    }>;
    version?: string;
}

interface EditorRendererProps {
    data: EditorJSData | string;
}

export default function EditorRenderer({ data }: EditorRendererProps) {
    let blocks: EditorJSData["blocks"] = [];

    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            blocks = parsed.blocks || [];
        } catch {
            return <div dangerouslySetInnerHTML={{ __html: data }} />;
        }
    } else {
        blocks = data.blocks || [];
    }

    if (!blocks.length) {
        return <p style={{ color: "#999" }}>Nessun contenuto</p>;
    }

    return (
        <div style={containerStyle}>
            {blocks.map((block, index) => (
                <Block key={index} block={block} />
            ))}
        </div>
    );
}

function Block({ block }: { block: { type: string; data: any } }) {
    switch (block.type) {
        case "header":
            return <HeaderBlock data={block.data} />;

        case "paragraph":
            return <ParagraphBlock data={block.data} />;

        case "list":
            return <ListBlock data={block.data} />;

        case "image":
            return <ImageBlock data={block.data} />;

        default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
    }
}

function HeaderBlock({ data }: { data: { text: string; level: number } }) {
    const fontSize = data.level === 2 ? 32 : data.level === 3 ? 24 : 20;

    const Tag = data.level === 1
        ? "h1"
        : data.level === 2
            ? "h2"
            : data.level === 3
                ? "h3"
                : "h4";

    return React.createElement(
        Tag,
        {
            style: {
                fontSize: `clamp(${fontSize - 8}px, ${fontSize / 4}vw, ${fontSize}px)`,
                marginTop: "clamp(24px, 6vw, 32px)",
                marginBottom: "clamp(12px, 3vw, 16px)",
                lineHeight: 1.3,
                fontWeight: 700,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
            },
            dangerouslySetInnerHTML: { __html: data.text },
        }
    );
}

function ParagraphBlock({ data }: { data: { text: string } }) {
    if (!data.text || data.text === "<br>") return null;

    return (
        <p
            style={{
                fontSize: "clamp(15px, 4vw, 18px)",
                lineHeight: 1.7,
                marginBottom: "clamp(16px, 4vw, 20px)",
                color: "#333",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: data.text }}
        />
    );
}

function ListBlock({ data }: { data: { style: "ordered" | "unordered"; items: string[] } }) {
    const Tag = data.style === "ordered" ? "ol" : "ul";

    return (
        <Tag
            style={{
                fontSize: "clamp(15px, 4vw, 18px)",
                lineHeight: 1.7,
                marginBottom: "clamp(16px, 4vw, 20px)",
                paddingLeft: "clamp(24px, 6vw, 32px)",
                wordWrap: "break-word",
                overflowWrap: "break-word",
            }}
        >
            {data.items.map((item, i) => (
                <li
                    key={i}
                    style={{
                        marginBottom: 8,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: item }}
                />
            ))}
        </Tag>
    );
}

function ImageBlock({ data }: { data: { file: { url: string; type?: string; mime?: string }; caption?: string } }) {
    const isVideo = data.file.type === "video" || data.file.mime?.startsWith("video/");
    const isGif = data.file.type === "gif" || data.file.url?.endsWith(".gif");

    return (
        <figure
            style={{
                margin: "clamp(24px, 6vw, 32px) 0",
                textAlign: "center",
            }}
        >
            {isVideo ? (
                <video
                    src={data.file.url}
                    controls
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 8,
                    }}
                />
            ) : (
                <img
                    src={data.file.url}
                    alt={data.caption || ""}
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 8,
                    }}
                />
            )}
            {data.caption && (
                <figcaption
                    style={{
                        marginTop: 12,
                        fontSize: "clamp(13px, 3.5vw, 15px)",
                        color: "#666",
                        fontStyle: "italic",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {data.caption}
                </figcaption>
            )}
        </figure>
    );
}

const containerStyle: React.CSSProperties = {
    maxWidth: 740,
    margin: "0 auto",
    padding: "clamp(20px, 5vw, 40px)",
    wordWrap: "break-word",
    overflowWrap: "break-word",
};