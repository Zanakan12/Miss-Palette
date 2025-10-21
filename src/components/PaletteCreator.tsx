"use client";

import React, { useState } from "react";

type Palette = {
    id: string;
    name?: string;
    colors: string[];
};

export default function PaletteCreator({ onSave }: { onSave?: (p: Palette) => void }) {
    const [name, setName] = useState("");
    const [colors, setColors] = useState<string[]>(["#ff6b6b", "#ffa94d", "#ffd43b", "#70efde", "#4dabf7"]);

    function updateColor(index: number, value: string) {
        const next = [...colors];
        next[index] = value;
        setColors(next);
    }

    function addColor() {
        setColors([...colors, "#ffffff"]);
    }

    function removeColor(index: number) {
        if (colors.length <= 1) return;
        setColors(colors.filter((_, i) => i !== index));
    }

    async function savePalette() {
        const palette: Palette = { id: `user-${Date.now()}`, name: name || "Untitled", colors };
        // Try server-side save first
        try {
            const res = await fetch('/api/palettes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(palette),
            });
            if (!res.ok) throw new Error('Server save failed');
            // success
            setName("");
            setColors(["#ff6b6b", "#ffa94d", "#ffd43b", "#70efde", "#4dabf7"]);
            if (onSave) onSave(palette);
            return;
        } catch (e) {
            // fallback to localStorage
            try {
                const raw = localStorage.getItem("userPalettes") || "[]";
                const arr = JSON.parse(raw);
                arr.unshift(palette);
                localStorage.setItem("userPalettes", JSON.stringify(arr));
                setName("");
                setColors(["#ff6b6b", "#ffa94d", "#ffd43b", "#70efde", "#4dabf7"]);
                if (onSave) onSave(palette);
            } catch (_) {
                console.error("Could not save palette");
            }
        }
    }

    return (
        <div className="palette-creator">
            <div className="creator-controls">
                <input
                    className="creator-name"
                    placeholder="Nom de la palette"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="creator-colors">
                    {colors.map((c, i) => (
                        <div key={i} className="creator-color-row">
                            <input
                                type="color"
                                value={c}
                                onChange={(e) => updateColor(i, e.target.value)}
                                aria-label={`Couleur ${i + 1}`}
                            />
                            <input
                                type="text"
                                className="creator-hex"
                                value={c}
                                onChange={(e) => updateColor(i, e.target.value)}
                            />
                            <button className="creator-remove" onClick={() => removeColor(i)} title="Supprimer">
                                −
                            </button>
                        </div>
                    ))}
                </div>

                <div className="creator-actions">
                    <button className="add-color" onClick={addColor} type="button">
                        Ajouter une couleur
                    </button>
                    <button className="save-palette" onClick={savePalette} type="button">
                        Sauvegarder la palette
                    </button>
                </div>
            </div>
        </div>
    );
}
