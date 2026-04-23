import type { Article, DualContent, MedicalSectionKey, MedicalSections } from "@/data/mockData";
import type { ArticleSeed } from "@/seeds/articlesSeeds";

const SECTION_TITLES: Record<MedicalSectionKey, string> = {
  definition: "Что это",
  causes: "Причины",
  symptoms: "Симптомы",
  diagnosis: "Диагностика",
  treatment: "Лечение",
  prevention: "Профилактика",
};

const DEFAULT_AUTHOR = "Редакция ОфтальмоВики";
const DEFAULT_AUTHOR_ROLE = "Редакционный материал";

const createSectionContent = (title: string, section: MedicalSectionKey): DualContent => ({
  simple: `${title}: ${SECTION_TITLES[section].toLowerCase()} — раздел подготовлен для понятного объяснения пациенту.`,
  professional: `${title}: ${SECTION_TITLES[section].toLowerCase()} — раздел подготовлен для медицинского описания специалисту.`,
});

const createMedicalSections = (seed: ArticleSeed): MedicalSections =>
  seed.sections.reduce<MedicalSections>((acc, section) => {
    acc[section] = createSectionContent(seed.title, section);
    return acc;
  }, {});

const createExcerpt = (seed: ArticleSeed) =>
  `${seed.title}: структурированная медицинская статья с материалами для пациентов и специалистов.`;

const createReadTime = (sectionCount: number) => `${Math.max(3, sectionCount * 2)} мин`;

export const generateArticle = (seed: ArticleSeed): Article => {
  const medicalSections = createMedicalSections(seed);

  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    excerpt: createExcerpt(seed),
    category: seed.categorySlug,
    categorySlug: seed.categorySlug,
    subcategorySlug: seed.subcategorySlug,
    author: DEFAULT_AUTHOR,
    authorRole: DEFAULT_AUTHOR_ROLE,
    date: new Date().toISOString().slice(0, 10),
    readTime: createReadTime(seed.sections.length),
    medicalSections,
    sections: [],
    relatedIds: [],
  };
};
