import { useParams } from "next/navigation";

export default function ArticoloDettaglio() {
  const params = useParams();
  return (
    <main style={{ padding: 32 }}>
      <h1>Articolo: {params.articleId}</h1>
      <p>Il contenuto dettagliato dell'articolo apparirà qui.</p>
    </main>
  );
}






