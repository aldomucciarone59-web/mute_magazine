import { useParams } from "next/navigation";

export default function CategoriaArticoli() {
  const params = useParams();
  return (
    <main style={{ padding: 32 }}>
      <h1>Categoria: {params.categoria}</h1>
      <p>Qui appariranno gli articoli di questa categoria.</p>
    </main>
  );
}






