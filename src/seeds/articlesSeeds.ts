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
    slug: "what-is-ophthalmology",
    title: "Что такое офтальмология",
    categorySlug: "general-info",
    subcategorySlug: "what-is-ophthalmology",
    sections: ["definition", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "eye-anatomy",
    title: "Анатомия и физиология глаза",
    categorySlug: "general-info",
    subcategorySlug: "eye-anatomy",
    sections: ["definition", "diagnosis", "prevention"],
  },
  {
    slug: "visual-analyzer",
    title: "Зрительный анализатор",
    categorySlug: "general-info",
    subcategorySlug: "visual-analyzer",
    sections: ["definition", "symptoms", "diagnosis", "prevention"],
  },
  {
    slug: "age-vision",
    title: "Возрастные особенности зрения",
    categorySlug: "general-info",
    subcategorySlug: "age-vision",
    sections: ["definition", "symptoms", "diagnosis", "prevention"],
  },
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
  {
    slug: "retinal-diseases",
    title: "Заболевания сетчатки",
    categorySlug: "diseases",
    subcategorySlug: "retina",
    sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "corneal-diseases",
    title: "Заболевания роговицы",
    categorySlug: "diseases",
    subcategorySlug: "cornea",
    sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "refractive-errors",
    title: "Аномалии рефракции",
    categorySlug: "diseases",
    subcategorySlug: "refraction",
    sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "eye-imaging",
    title: "Визуализация в офтальмологии",
    categorySlug: "diagnostics",
    subcategorySlug: "imaging",
    sections: ["definition", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "functional-eye-tests",
    title: "Функциональные тесты зрения",
    categorySlug: "diagnostics",
    subcategorySlug: "functional-tests",
    sections: ["definition", "diagnosis", "prevention"],
  },
  {
    slug: "eye-surgery",
    title: "Хирургия глаза",
    categorySlug: "treatment",
    subcategorySlug: "surgery",
    sections: ["definition", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "laser-eye-treatment",
    title: "Лазерное лечение глаз",
    categorySlug: "treatment",
    subcategorySlug: "laser",
    sections: ["definition", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "ophthalmic-pharmacology",
    title: "Фармакотерапия в офтальмологии",
    categorySlug: "treatment",
    subcategorySlug: "pharmacology",
    sections: ["definition", "diagnosis", "treatment", "prevention"],
  },
  {
    slug: "vision-prevention",
    title: "Профилактика нарушений зрения",
    categorySlug: "prevention",
    subcategorySlug: "prevention",
    sections: ["definition", "causes", "symptoms", "diagnosis", "prevention"],
  },
];
