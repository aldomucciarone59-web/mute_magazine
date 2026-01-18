export type ArticleCard = {
  _id: string;        // MongoDB ID
  id: string;         // UUID usato per URL
  title: string;
  subtitle: string;
  author: string;
  date: string;
  cover: string;      // link o percorso immagine
  category: string;   // la categoria dell'articolo
  content: string;    // testo completo
};

export const categoryLabels: Record<string, string> = {
  cultura: "Cultura",
  societa: "Società",
  riflessioni: "Riflessioni",
  curiosita: "Curiosità",
};
