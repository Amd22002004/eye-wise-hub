import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export interface DualContent {
  simple: string;
  professional: string;
}

export interface MedicalSections {
  definition?: DualContent;
  causes?: DualContent;
  symptoms?: DualContent;
  diagnosis?: DualContent;
  treatment?: DualContent;
  prevention?: DualContent;
}

export type MedicalSectionKey = keyof MedicalSections;

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  subcategorySlug?: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  medicalSections?: MedicalSections;
  sections: { title: string; content: string; simpleContent?: string }[];
  relatedIds: string[];
  seedType?: "symptom" | "disease" | "diagnostics" | "treatment";
  contentIntent?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  icon: string;
  parentId?: string;
}

export const MEDICAL_SECTION_LABELS: Record<MedicalSectionKey, string> = {
  definition: "Что это",
  causes: "Причины",
  symptoms: "Симптомы",
  diagnosis: "Диагностика",
  treatment: "Лечение",
  prevention: "Профилактика",
};

type ArticleRow = Tables<"articles">;
type CategoryRow = Tables<"categories">;
type AuthorRow = Tables<"authors">;
type RelationRow = Tables<"article_relations">;

interface ContentPayload {
  articles: Article[];
  categories: Category[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeDate = (value: string | null) => (value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10));

const mapCategory = (row: CategoryRow, articleCount: number): Category => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description ?? "",
  icon: row.icon ?? "📁",
  parentId: row.parent_id ?? undefined,
  articleCount,
});

const mapArticle = (
  row: ArticleRow,
  categoriesById: Map<string, CategoryRow>,
  authorsById: Map<string, AuthorRow>,
  relations: RelationRow[],
): Article => {
  const content = isRecord(row.content_json) ? row.content_json : {};
  const category = row.category_id ? categoriesById.get(row.category_id) : undefined;
  const subcategory = row.subcategory_id ? categoriesById.get(row.subcategory_id) : undefined;
  const author = row.author_id ? authorsById.get(row.author_id) : undefined;
  const sections = Array.isArray(content.sections) ? content.sections : [];
  const relatedIds = relations
    .filter((relation) => relation.article_id === row.id && relation.related_article_id)
    .map((relation) => relation.related_article_id as string);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: category?.name ?? "Без категории",
    categorySlug: category?.slug ?? "uncategorized",
    subcategorySlug: subcategory?.slug,
    author: author?.name ?? "Редакция",
    authorRole: author?.role ?? "Медицинский редактор",
    date: normalizeDate(row.updated_at ?? row.created_at),
    readTime: `${row.read_time ?? 5} мин`,
    medicalSections: isRecord(content.medicalSections) ? (content.medicalSections as unknown as MedicalSections) : undefined,
    sections: sections as Article["sections"],
    relatedIds,
    seedType: typeof content.seedType === "string" ? (content.seedType as Article["seedType"]) : undefined,
    contentIntent: typeof content.contentIntent === "string" ? content.contentIntent : undefined,
  };
};

export async function fetchContent(includeDrafts = false): Promise<ContentPayload> {
  const articleQuery = supabase.from("articles").select("*").order("created_at", { ascending: false });
  const [articlesResult, categoriesResult, authorsResult, relationsResult] = await Promise.all([
    includeDrafts ? articleQuery : articleQuery.eq("status", "published"),
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase.from("authors").select("*"),
    supabase.from("article_relations").select("*"),
  ]);

  if (articlesResult.error) throw articlesResult.error;
  if (categoriesResult.error) throw categoriesResult.error;
  if (authorsResult.error) throw authorsResult.error;
  if (relationsResult.error) throw relationsResult.error;

  const articleRows = articlesResult.data ?? [];
  const categoryRows = categoriesResult.data ?? [];
  const authorRows = authorsResult.data ?? [];
  const relationRows = relationsResult.data ?? [];
  const categoriesById = new Map(categoryRows.map((category) => [category.id, category]));
  const authorsById = new Map(authorRows.map((author) => [author.id, author]));
  const counts = new Map<string, number>();

  for (const article of articleRows) {
    if (article.category_id) counts.set(article.category_id, (counts.get(article.category_id) ?? 0) + 1);
    if (article.subcategory_id) counts.set(article.subcategory_id, (counts.get(article.subcategory_id) ?? 0) + 1);
  }

  return {
    articles: articleRows.map((article) => mapArticle(article, categoriesById, authorsById, relationRows)),
    categories: categoryRows.map((category) => mapCategory(category, counts.get(category.id) ?? 0)),
  };
}

export const getRootCategories = (categories: Category[]) => categories.filter((category) => !category.parentId);
export const getChildCategories = (categories: Category[], parentId: string) => categories.filter((category) => category.parentId === parentId);
export const getCategoryBySlug = (categories: Category[], slug: string) => categories.find((category) => category.slug === slug);