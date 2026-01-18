export type ArticleCard = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  cover: string;
};

export const articlesByCategory: Record<string, ArticleCard[]> = {
  cultura: [
    {
      id: "cultura-1",
      title: "Il segno che le nostre azioni lasciano",
      subtitle: "Percorsi visivi nella memoria collettiva",
      author: "Redazione Cultura",
      date: "07/01",
      cover: "/papera_cultura.png",
    },
    {
      id: "cultura-2",
      title: "Elogio a Kurt Cobain",
      subtitle: "Diario di un mito inquieto",
      author: "Alba Orpheline",
      date: "05/28",
      cover: "/papera_cultura.png",
    },
    {
      id: "cultura-3",
      title: "Segreti proibiti",
      subtitle: "Suore ribelli e pioniere della libertà",
      author: "Mute Collective",
      date: "06/11",
      cover: "/papera_cultura.png",
    },
  ],
  societa: [
    {
      id: "societa-1",
      title: "Rituali metropolitani",
      subtitle: "Come cambiano i gesti nella città liquida",
      author: "Nina Rituale",
      date: "04/02",
      cover: "/Papera_società.png",
    },
    {
      id: "societa-2",
      title: "Archivio della partecipazione",
      subtitle: "Storie di assemblee e piazze",
      author: "Mute Field Team",
      date: "03/19",
      cover: "/Papera_società.png",
    },
    {
      id: "societa-3",
      title: "Il segno che le nostre azioni lasciano",
      subtitle: "Cronache dal quartiere che cambia",
      author: "Archivio Urbano",
      date: "02/09",
      cover: "/Papera_società.png",
    },
  ],
  riflessioni: [
    {
      id: "riflessioni-1",
      title: "Manifesto dei silenzi condivisi",
      subtitle: "Appunti su ascolto, cura, vulnerabilità",
      author: "Mute Lab",
      date: "06/22",
      cover: "/Papera_riflessioni.png",
    },
    {
      id: "riflessioni-2",
      title: "Corpi che ricordano",
      subtitle: "Una coreografia intima",
      author: "Esther F.",
      date: "05/30",
      cover: "/Papera_riflessioni.png",
    },
    {
      id: "riflessioni-3",
      title: "Elogio a Kurt Cobain",
      subtitle: "Un dialogo immaginario",
      author: "Rosa M.",
      date: "05/10",
      cover: "/Papera_riflessioni.png",
    },
  ],
  curiosita: [
    {
      id: "curiosita-1",
      title: "Musei invisibili",
      subtitle: "Collezioni private e segrete",
      author: "Luce O.",
      date: "03/05",
      cover: "/papera_curiosità.png",
    },
    {
      id: "curiosita-2",
      title: "Librerie clandestine",
      subtitle: "Topografie del desiderio",
      author: "Mute Collectors",
      date: "02/20",
      cover: "/papera_curiosità.png",
    },
    {
      id: "curiosita-3",
      title: "Segreti proibiti",
      subtitle: "La città sotterranea",
      author: "Eva Notturna",
      date: "01/18",
      cover: "/papera_curiosità.png",
    },
  ],
};

export const categoryLabels: Record<string, string> = {
  cultura: "Cultura",
  societa: "Società",
  riflessioni: "Riflessioni",
  curiosita: "Curiosità",
};

