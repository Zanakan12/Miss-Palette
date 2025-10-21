import PalettesApp from "../components/PalettesApp";

export default function Home() {
  return (
    <main className="page-root">
      <header className="page-header">
        <h1>Gestionnaire de couleurs</h1>
        <p className="lead">Crée tes palettes — modifie les couleurs, sauvegarde et retrouve-les ici.</p>
      </header>

      <PalettesApp />
    </main>
  );
}
