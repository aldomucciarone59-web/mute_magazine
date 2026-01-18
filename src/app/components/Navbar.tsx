"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const buttonStyle = {
  color: "#fff",
  fontWeight: 500,
  fontFamily: "var(--font-mattone), Arial, Helvetica, sans-serif",
};
const categories = [
  { path: "/articoli/cultura", label: "Cultura" },
  { path: "/articoli/societa", label: "Società" },
  { path: "/articoli/riflessioni", label: "Riflessioni" },
  { path: "/articoli/curiosita", label: "Curiosità" },
];

export default function Navbar() {
  const [drop, setDrop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setDrop(false);
      }
    }
    if (drop) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [drop]);

  useEffect(() => {
    if (searchOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timeout);
    }
  }, [searchOpen]);

  return (
    <nav
      style={{
        width: "100%",
        height: "clamp(56px, 12vw, 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 32px)",
        background: "#000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', gap: 'clamp(12px, 3vw, 24px)' }}>
        <Link href="/about" style={{ ...buttonStyle, fontSize: 'clamp(13px, 3.2vw, 16px)' }}>
          About Us
        </Link>
        <div style={{ position: "relative" }} ref={dropRef}>
          <span
            style={{ ...buttonStyle, cursor: "pointer", fontSize: 'clamp(13px, 3.2vw, 16px)' }}
            onClick={() => setDrop((d) => !d)}
            tabIndex={0}
          >
            Articoli ▼
          </span>
          {drop && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 6,
                boxShadow: "0 4px 16px rgba(20,20,20,0.09)",
                minWidth: 140,
                zIndex: 3000,
                padding: '4px 0'
              }}
            >
              {categories.map((cat) => (
                <Link
                  href={cat.path}
                  key={cat.path}
                  style={{
                    display: "block",
                    padding: "10px 18px",
                    textDecoration: "none",
                    ...buttonStyle,
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                    fontSize: 'clamp(13px, 3.2vw, 16px)',
                  }}
                  onClick={() => setDrop(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/mute_logo_prova.png"
            alt="Mute magazine logo"
            width={55}
            height={40}
            style={{ objectFit: "contain", maxHeight: "clamp(32px, 8vw, 40px)", width: "auto", display: "block" }}
            priority
          />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 'clamp(12px, 3vw, 24px)' }}>
        <a href="#contatti" style={{ ...buttonStyle, fontSize: 'clamp(13px, 3.2vw, 16px)' }}>
          Contatti
        </a>
        <button
          style={{
            ...buttonStyle,
            fontSize: 'clamp(13px, 3.2vw, 16px)',
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setSearchOpen(true)}
        >
          Cerca
        </button>
      </div>
      {searchOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000,
            padding: 16,
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              width: "min(480px, 90vw)",
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 18px 50px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSearchOpen(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#555",
              }}
              aria-label="Chiudi ricerca"
            >
              ×
            </button>
            <h2 style={{ margin: "0 0 16px", fontSize: 22, color: "#111" }}>
              Cerca nel magazine
            </h2>
            <input
              ref={inputRef}
              type="text"
              placeholder="Cerca articoli, categorie, tag..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 16,
                outline: "none",
              }}
            />
            <button
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Avvia ricerca
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
