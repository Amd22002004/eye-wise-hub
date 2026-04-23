import type { MedicalSectionKey } from "@/data/mockData";

export const seoIntents = [
  "что это",
  "симптомы",
  "лечение",
  "причины",
  "диагностика",
  "профилактика",
] as const;

export type SeoIntent = (typeof seoIntents)[number];

export type SeoIntentSlug = "overview" | "symptoms" | "treatment" | "causes" | "diagnosis" | "prevention";

export const seoIntentBySlug: Record<SeoIntentSlug, SeoIntent> = {
  overview: "что это",
  symptoms: "симптомы",
  treatment: "лечение",
  causes: "причины",
  diagnosis: "диагностика",
  prevention: "профилактика",
};

export const seoSectionByIntentSlug: Record<SeoIntentSlug, MedicalSectionKey> = {
  overview: "definition",
  symptoms: "symptoms",
  treatment: "treatment",
  causes: "causes",
  diagnosis: "diagnosis",
  prevention: "prevention",
};

export const seoIntentSlugs = Object.keys(seoIntentBySlug) as SeoIntentSlug[];

export const isSeoIntentSlug = (value?: string): value is SeoIntentSlug =>
  Boolean(value && value in seoIntentBySlug);

export const getSeoIntentPath = (articleSlug: string, intentSlug: SeoIntentSlug) =>
  intentSlug === "overview" ? `/${articleSlug}` : `/${articleSlug}/${intentSlug}`;