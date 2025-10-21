"use client";

import React, { useState, useEffect } from "react";

type Palette = {
    id: string;
    name?: string;
    colors: string[];
};

export default function PaletteCard({ palette, onDelete }: { palette: Palette; onDelete?: (id: string) => void }) {
    const [copied, setCopied] = useState<string | null>(null);
    const [fav, setFav] = useState(false);

    useEffect(() => {
        try {
            const favs = JSON.parse(localStorage.getItem("favPalettes") || "[]");
            setFav(favs.includes(palette.id));
        } catch (_) {
            setFav(false);
        }
    }, [palette.id]);

    function copyHex(hex: string) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(hex).then(() => {
                setCopied(hex);
                setTimeout(() => setCopied(null), 1200);
            });
        }
    }

    function toggleFav() {
        try {
            const raw = localStorage.getItem("favPalettes") || "[]";
            const favs: string[] = JSON.parse(raw);
            const idx = favs.indexOf(palette.id);
            if (idx === -1) {
                favs.push(palette.id);
                setFav(true);
            } else {
                favs.splice(idx, 1);
                setFav(false);
            }
            localStorage.setItem("favPalettes", JSON.stringify(favs));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="palette-card">
            <div className="palette-swatch-row">
                {palette.colors.map((c, i) => (
                    <button
                        key={`${palette.id}-${i}`}
                        aria-label={`Copier ${c}`}
                        className="swatch"
                        onClick={() => copyHex(c)}
                        style={{ background: c }}
                        title={`Copier ${c}`}
                    >
                        <span className="swatch-hex">{copied === c ? "copied" : c}</span>
                    </button>
                ))}
            </div>

            <div className="palette-footer">
                <div className="palette-name">{palette.name || "Untitled"}</div>
                <div className="palette-actions">
                    <button className="fav-btn" onClick={toggleFav} aria-pressed={fav}>
                        {fav ? "★" : "☆"}
                    </button>
                    {onDelete ? (
                        <button className="delete-btn" onClick={() => onDelete(palette.id)} title="Supprimer la palette">
                            🗑
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
