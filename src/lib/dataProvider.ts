import { supabase } from "@/integrations/supabase/client";
import { articles, categories, type Article, type MedicalSections } from "@/data/mockData";
import type { Database } from "@/integrations/supabase/types";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type SymptomRow = Database["public"]["Tables"]["symptoms"]["Row"];
type SymptomDiseaseMapRow = Database["public"]["Tables"]["symptom_disease_map"]["Row"];

export interface SymptomItem {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface SymptomPageData {
  symptom: SymptomItem;
  causes: Article[];
  relatedSymptoms: SymptomItem[];
}

const isMedicalSections = (value: unknown): value is MedicalSections =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getMedicalSections = (item: ArticleRow | Article): MedicalSections => {
  const content = "content_json" in item ? item.content_json : item.medicalSections;
  return isMedicalSections(content) ? content : {};
};

const mapArticle = (item: ArticleRow | Article): Article => ({
  ...item,
  excerpt: item.excerpt || "",
  category: "category" in item ? item.category : "Заболевания глаз",
  categorySlug: "categorySlug" in item ? item.categorySlug : "diseases",
  author: "author" in item ? item.author : "Редакция",
  authorRole: "authorRole" in item ? item.authorRole : "Медицинская редакция",
  date: "date" in item ? item.date : item.updated_at || item.created_at || "",
  readTime: "readTime" in item ? item.readTime : `${item.read_time || 5} мин`,
  medicalSections: getMedicalSections(item),
  sections: "sections" in item ? item.sections : [],
  relatedIds: "relatedIds" in item ? item.relatedIds : [],
});

const normalizeSymptomSlug = (article: Article) => article.subcategorySlug || article.slug.replace(/-symptom$/, "");

const fallbackSymptoms = (): SymptomItem[] =>
  articles
    .filter((article) => article.categorySlug === "symptoms")
    .map((article) => ({
      id: article.id,
      slug: normalizeSymptomSlug(article),
      name: article.title.replace(/[:：].*$/, ""),
      description: article.excerpt,
    }));

const causePriority = (article: Article) => {
  const slug = article.slug.toLowerCase();
  if (slug.includes("glaucoma")) return 100;
  if (slug.includes("cataract")) return 90;
  if (slug.includes("retina") || slug.includes("retinopathy")) return 85;
  if (slug.includes("myopia")) return 65;
  if (slug.includes("dry-eye")) return 45;
  return 50;
};

export async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published");

  if (error || !data || data.length === 0) {
    console.log("Using mock data fallback");
    return articles;
  }

  console.log("Using Supabase data");
  return data.map(mapArticle);
}

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error || !data || data.length === 0) {
    console.log("Using mock data fallback");
    return categories;
  }

  console.log("Using Supabase data");
  return data;
}

export async function getSymptoms(): Promise<SymptomItem[]> {
  const { data, error } = await supabase.from("symptoms").select("id, slug, name, description");

  if (error || !data || data.length === 0) {
    return fallbackSymptoms();
  }

  return data.map((symptom: SymptomRow) => ({
    id: symptom.id,
    slug: symptom.slug,
    name: symptom.name,
    description: symptom.description || "",
  }));
}

export async function getSymptomPageData(slug: string): Promise<SymptomPageData | null> {
  const [symptoms, allArticles] = await Promise.all([getSymptoms(), getArticles()]);
  const symptom = symptoms.find((item) => item.slug === slug);

  if (!symptom) return null;

  const { data: relationRows } = await supabase
    .from("symptom_disease_map")
    .select("symptom_id, article_id")
    .eq("symptom_id", symptom.id);

  const relationArticleIds = new Set((relationRows || []).map((row: SymptomDiseaseMapRow) => row.article_id).filter(Boolean));
  const symptomArticle = allArticles.find(
    (article) => article.categorySlug === "symptoms" && normalizeSymptomSlug(article) === slug
  );
  const fallbackRelatedIds = new Set(symptomArticle?.relatedIds || []);
  const diseases = allArticles.filter((article) => article.categorySlug === "diseases");
  const causes = diseases
    .filter((article) => relationArticleIds.has(article.id) || fallbackRelatedIds.has(article.id))
    .sort((a, b) => causePriority(b) - causePriority(a));

  const relatedSymptoms = symptoms.filter((item) => item.slug !== slug).slice(0, 4);

  return { symptom, causes, relatedSymptoms };
}
