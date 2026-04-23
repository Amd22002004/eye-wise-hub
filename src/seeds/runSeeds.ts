import { supabase } from "@/integrations/supabase/client";
import type { Json, TablesInsert } from "@/integrations/supabase/types";
import { articleSeeds } from "@/seeds/articlesSeeds";
import { generateArticle } from "@/lib/generateArticle";

type MedicalSection = {
  simple: string;
  professional: string;
};

type MedicalSections = {
  definition?: MedicalSection;
  causes?: MedicalSection;
  symptoms?: MedicalSection;
  diagnosis?: MedicalSection;
  treatment?: MedicalSection;
  prevention?: MedicalSection;
};

type ArticleSeedPayload = Pick<
  TablesInsert<"articles">,
  "slug" | "title" | "excerpt" | "read_time" | "status" | "content_json" | "category_id" | "subcategory_id"
>;

type CategoryRef = { id: string; slug: string; parent_id: string | null };

const isMedicalSection = (section: unknown): section is MedicalSection => {
  if (!section || typeof section !== "object") return false;

  const candidate = section as Record<string, unknown>;
  return typeof candidate.simple === "string" && typeof candidate.professional === "string";
};

const isValidMedicalSections = (data: unknown): data is MedicalSections => {
  if (!data || typeof data !== "object") return false;
  return Object.values(data).some(isMedicalSection);
};

const canAccessArticlesTable = async () => {
  const { error } = await supabase.from("articles").select("id").limit(1);

  if (error) {
    console.error("Seed aborted: articles table is unavailable or inaccessible", error);
    return false;
  }

  return true;
};

const getReadTimeMinutes = (readTime: string) => {
  const minutes = Number.parseInt(readTime, 10);
  return Number.isNaN(minutes) ? null : minutes;
};

const getCategoryRefs = async () => {
  const { data, error } = await supabase.from("categories").select("id, slug, parent_id");

  if (error || !data) {
    console.error("Seed aborted: categories are unavailable", error);
    return null;
  }

  return new Map(data.map((category: CategoryRef) => [category.slug, category]));
};

const getExistingArticleSlugs = async () => {
  const { data, error } = await supabase.from("articles").select("slug");

  if (error || !data) {
    console.error("Seed aborted: existing articles are unavailable", error);
    return null;
  }

  return new Set(data.map((article) => article.slug));
};

export const runArticleSeeds = async () => {
  const { error } = await supabase.functions.invoke("seed-articles");

  if (!error) {
    console.log("Article seeds invoked through backend function");
    return;
  }

  console.error("Backend seed function failed, trying client fallback", error);

  const hasArticlesTable = await canAccessArticlesTable();
  if (!hasArticlesTable) return;

  const [categoryRefs, existingSlugs] = await Promise.all([getCategoryRefs(), getExistingArticleSlugs()]);
  if (!categoryRefs || !existingSlugs) return;

  for (const seed of articleSeeds) {
    if (existingSlugs.has(seed.slug)) {
      console.log(`Seed skipped, already exists: ${seed.slug}`);
      continue;
    }

    const article = generateArticle(seed);
    const category = categoryRefs.get(seed.categorySlug);
    const subcategory = categoryRefs.get(seed.subcategorySlug);

    if (!isValidMedicalSections(article.medicalSections)) {
      console.error(`Seed skipped, invalid medical sections for slug: ${article.slug}`);
      continue;
    }

    if (!category || !subcategory) {
      console.error(`Seed skipped, category not found for slug: ${article.slug}`);
      continue;
    }

    const payload: ArticleSeedPayload = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      read_time: getReadTimeMinutes(article.readTime),
      status: "published",
      content_json: article.medicalSections as unknown as Json,
      category_id: category.id,
      subcategory_id: subcategory.id,
    };

    const { error: insertError } = await supabase
      .from("articles")
      .insert(payload);

    if (insertError) {
      console.error(`Seed insert failed for slug: ${article.slug}`, insertError);
      continue;
    }

    existingSlugs.add(seed.slug);
    console.log(`Seed upserted: ${article.slug}`);
  }
};
