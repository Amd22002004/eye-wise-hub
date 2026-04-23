export type ArticleSectionKey =
  | "definition"
  | "causes"
  | "symptoms"
  | "diagnosis"
  | "treatment"
  | "prevention";

export interface ArticleSeed {
  slug: string;
  title: string;
  categorySlug: string;
  subcategorySlug: string;
  sections: ArticleSectionKey[];
}

export const articleSeeds: ArticleSeed[] = [
  {
    slug: "glaucoma",
    title: "Глаукома",
    categorySlug: "diseases",
    subcategorySlug: "glaucoma-cat",
    sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "cataract",
    title: "Катаракта",
    categorySlug: "diseases",
    subcategorySlug: "cataract-cat",
    sections: ["definition", "symptoms", "treatment"],
  },
];
