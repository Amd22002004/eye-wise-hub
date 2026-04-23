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
  "slug" | "title" | "excerpt" | "read_time" | "status" | "content_json"
>;

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

export const runArticleSeeds = async () => {
  const hasArticlesTable = await canAccessArticlesTable();
  if (!hasArticlesTable) return;

  for (const seed of articleSeeds) {
    const article = generateArticle(seed);

    if (!isValidMedicalSections(article.medicalSections)) {
      console.error(`Seed skipped, invalid medical sections for slug: ${article.slug}`);
      continue;
    }

    const payload: ArticleSeedPayload = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      read_time: getReadTimeMinutes(article.readTime),
      status: "published",
      content_json: article.medicalSections as unknown as Json,
    };

    const { error: upsertError } = await supabase
      .from("articles")
      .upsert(payload, { onConflict: "slug" });

    if (upsertError) {
      console.error(`Seed upsert failed for slug: ${article.slug}`, upsertError);
      continue;
    }

    console.log(`Seed upserted: ${article.slug}`);
  }
};
