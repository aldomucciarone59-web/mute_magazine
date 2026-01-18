"use client";

import { useParams } from "next/navigation";
import ArticleGrid from "@/app/components/ArticleGrid";
import { categoryLabels } from "@/data/articles";

export default function CategoriaArticoli() {
  const params = useParams();
  const categoryParam = typeof params.categoria === "string" ? params.categoria : "cultura";

  // fallback se categoria non esiste nelle etichette
  const category = categoryLabels[categoryParam] ? categoryParam : "cultura";

  return <ArticleGrid category={category} />;
}
