import type { Article, MedicalSectionKey } from "@/data/mockData";
import { MEDICAL_SECTION_LABELS } from "@/data/mockData";
import { getSeoIntentPath, seoSectionByIntentSlug, type SeoIntentSlug } from "@/seo/seoTypes";

export interface InternalLinkItem {
  label: string;
  to: string;
  section: MedicalSectionKey;
}

export interface ContextualLinkRule {
  phrase: string;
  to: string;
}

const SECTION_LINK_COPY: Partial<Record<SeoIntentSlug, (title: string) => string>> = {
  symptoms: (title) => `Подробнее о симптомах ${title.toLowerCase()}`,
  treatment: (title) => `Как лечат ${title.toLowerCase()}`,
  diagnosis: (title) => `Методы диагностики ${title.toLowerCase()}`,
  causes: (title) => `Причины ${title.toLowerCase()}`,
  prevention: (title) => `Профилактика ${title.toLowerCase()}`,
};

export const getSameConditionLinks = (article: Article, keys: MedicalSectionKey[], activeSection: MedicalSectionKey): InternalLinkItem[] =>
  (["symptoms", "treatment", "diagnosis", "causes", "prevention"] as SeoIntentSlug[])
    .map((intentSlug) => ({ intentSlug, section: seoSectionByIntentSlug[intentSlug] }))
    .filter(({ section }) => section !== activeSection && keys.includes(section))
    .map(({ intentSlug, section }) => ({
      section,
      to: getSeoIntentPath(article.slug, intentSlug),
      label: SECTION_LINK_COPY[intentSlug]?.(article.title) ?? `${MEDICAL_SECTION_LABELS[section]} ${article.title.toLowerCase()}`,
    }))
    .slice(0, 5);

export const getNextStepLinks = (article: Article, keys: MedicalSectionKey[], currentSection: MedicalSectionKey): InternalLinkItem[] => {
  const flow: Partial<Record<MedicalSectionKey, SeoIntentSlug[]>> = {
    definition: ["symptoms", "diagnosis"],
    causes: ["symptoms", "prevention"],
    symptoms: ["diagnosis", "treatment"],
    diagnosis: ["treatment", "prevention"],
    treatment: ["prevention", "diagnosis"],
    prevention: ["symptoms", "diagnosis"],
  };

  return (flow[currentSection] ?? [])
    .map((intentSlug) => ({ intentSlug, section: seoSectionByIntentSlug[intentSlug] }))
    .filter(({ section }) => keys.includes(section))
    .map(({ intentSlug, section }) => ({
      section,
      to: getSeoIntentPath(article.slug, intentSlug),
      label: section === "diagnosis" ? "Перейти к диагностике" : section === "treatment" ? "Узнать о лечении" : `${MEDICAL_SECTION_LABELS[section]}: следующий шаг`,
    }))
    .slice(0, 2);
};

export const getContextualLinkRules = (articleSlug: string, section: MedicalSectionKey): ContextualLinkRule[] => {
  const rules: ContextualLinkRule[] = [
    { phrase: "повышение ВГД", to: getSeoIntentPath(articleSlug, "diagnosis") },
    { phrase: "внутриглазного давления", to: getSeoIntentPath(articleSlug, "diagnosis") },
    { phrase: "поле зрения", to: getSeoIntentPath(articleSlug, "diagnosis") },
    { phrase: "ОКТ", to: getSeoIntentPath(articleSlug, "diagnosis") },
    { phrase: "капли", to: getSeoIntentPath(articleSlug, "treatment") },
    { phrase: "лазер", to: getSeoIntentPath(articleSlug, "treatment") },
    { phrase: "операция", to: getSeoIntentPath(articleSlug, "treatment") },
    { phrase: "факторы риска", to: getSeoIntentPath(articleSlug, "causes") },
    { phrase: "профилактика", to: getSeoIntentPath(articleSlug, "prevention") },
  ];

  return rules.filter((rule) => {
    if (section === "diagnosis") return !rule.to.endsWith("/diagnosis");
    if (section === "treatment") return !rule.to.endsWith("/treatment");
    if (section === "causes") return !rule.to.endsWith("/causes");
    if (section === "prevention") return !rule.to.endsWith("/prevention");
    return true;
  });
};

const SYMPTOM_DISEASES: Record<string, string[]> = {
  "затуманивание зрения": ["glaucoma", "cataract"],
  "снижение зрения": ["glaucoma", "cataract"],
  "радужные круги": ["glaucoma"],
  "боль в глазу": ["glaucoma"],
  "блики": ["cataract"],
};

export const getSymptomDiseaseLinks = (text: string, allArticles: Article[], currentSlug: string): Article[] => {
  const lowerText = text.toLowerCase();
  const diseaseSlugs = new Set(
    Object.entries(SYMPTOM_DISEASES)
      .filter(([symptom]) => lowerText.includes(symptom))
      .flatMap(([, slugs]) => slugs)
      .filter((slug) => slug !== currentSlug)
  );

  return allArticles.filter((item) => diseaseSlugs.has(item.slug)).slice(0, 3);
};

export const getRelatedDiseases = (current: Article, allArticles: Article[]): Article[] =>
  allArticles
    .filter((item) => item.slug !== current.slug && item.categorySlug === current.categorySlug)
    .slice(0, 3);