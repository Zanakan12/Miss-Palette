"use client";

import React, { useEffect, useState } from "react";
import PaletteCard from "./PaletteCard";
import PaletteCreator from "./PaletteCreator";

type Palette = { id: string; name?: string; colors: string[] };

const DEFAULTS: Palette[] = [
    { id: "p1", name: "Sunset", colors: ["#ff6b6b", "#ffa94d", "#ffd43b", "#70efde", "#4dabf7"] },
    { id: "p2", name: "Pastel", colors: ["#f8c8dc", "#c8f1d2", "#c8e7f6", "#f6e7c8", "#e8d5ff"] },
    { id: "p3", name: "Forest", colors: ["#083d33", "#176f5a", "#2a9d8f", "#52b788", "#95d5b2"] },
    { id: "p4", name: "Vibrant", colors: ["#ff4d6d", "#ff7ab6", "#845ef7", "#5c7cfa", "#339af0"] },
];

export default function PalettesApp() {
    const [userPalettes, setUserPalettes] = useState<Palette[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            // try API first
            try {
                const res = await fetch('/api/palettes');
                if (res.ok) {
                    const data = await res.json() as Palette[];
                    if (mounted) return setUserPalettes(data);
                }
            } catch (_) {
                // ignore and fallback to localStorage
            }

            try {
                const raw = localStorage.getItem("userPalettes") || "[]";
                const arr = JSON.parse(raw) as Palette[];
                if (mounted) setUserPalettes(arr);
            } catch (_) {
                if (mounted) setUserPalettes([]);
            }
        })();
        return () => { mounted = false };
    }, []);

    function handleSaved(p: Palette) {
        setUserPalettes((s) => [p, ...s]);
    }

    function handleDelete(id: string) {
        (async () => {
            try {
                const res = await fetch(`/api/palettes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Server delete failed');
                setUserPalettes((s) => s.filter((x) => x.id !== id));
                return;
            } catch (_) {
                // fallback to localStorage
                try {
                    const raw = localStorage.getItem("userPalettes") || "[]";
                    const arr = JSON.parse(raw) as Palette[];
                    const next = arr.filter((x) => x.id !== id);
                    localStorage.setItem("userPalettes", JSON.stringify(next));
                    setUserPalettes((s) => s.filter((x) => x.id !== id));
                } catch (__) {
                    console.error("Could not delete palette");
                }
            }
        })();
    }

    return (
        <div className="palettes-app">
            <PaletteCreator onSave={handleSaved} />

            <h2 style={{ marginTop: 18 }}>Vos palettes</h2>
            <section className="palette-grid">
                {userPalettes.length === 0 ? (
                    <em>Aucune palette enregistrée</em>
                ) : (
                    userPalettes.map((p) => <PaletteCard key={p.id} palette={p} onDelete={handleDelete} />)
                )}
            </section>

            <h2 style={{ marginTop: 18 }}>Palettes publiques</h2>
            <section className="palette-grid">
                {DEFAULTS.map((p) => (
                    <PaletteCard key={p.id} palette={p} />
                ))}
            </section>
        </div>
    );
}
