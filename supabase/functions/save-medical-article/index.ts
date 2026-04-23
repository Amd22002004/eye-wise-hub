import { createClient } from "npm:@supabase/supabase-js@2.104.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2.104.0/cors";

type SectionKey = "definition" | "causes" | "symptoms" | "diagnosis" | "treatment" | "prevention";
type MedicalSections = Record<SectionKey, { simple: string; professional: string }>;

const sectionKeys: SectionKey[] = ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"];
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const slugify = (value: string) => value.toLowerCase().trim().replace(/ё/g, "e").replace(/[^a-z0-9а-я]+/g, "-").replace(/^-+|-+$/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return response({ error: "Missing backend credentials" }, 500);

  const body = await req.json().catch(() => null) as null | {
    title?: string; excerpt?: string; categorySlug?: string; subcategorySlug?: string | null; status?: "draft" | "published";
    authorId?: string | null; symptomIds?: string[]; medicalSections?: MedicalSections;
  };

  if (!body?.title || !body.categorySlug || !body.status || !["draft", "published"].includes(body.status)) {
    return response({ error: "Invalid article payload" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, slug").in("slug", [body.categorySlug, body.subcategorySlug].filter(Boolean));
  if (categoriesError) return response({ error: categoriesError.message }, 500);

  const categoryId = categories?.find((category) => category.slug === body.categorySlug)?.id ?? null;
  const subcategoryId = categories?.find((category) => category.slug === body.subcategorySlug)?.id ?? null;
  const slugBase = slugify(body.title);
  const medicalSections = Object.fromEntries(sectionKeys.map((key) => [key, body.medicalSections?.[key] ?? { simple: "", professional: "" }]));

  const { data: article, error: articleError } = await supabase.from("articles").insert({
    title: body.title,
    slug: slugBase,
    excerpt: body.excerpt || null,
    content_json: medicalSections,
    category_id: categoryId,
    subcategory_id: subcategoryId,
    author_id: body.authorId || null,
    status: body.status,
    read_time: Math.max(3, sectionKeys.filter((key) => medicalSections[key].simple || medicalSections[key].professional).length * 2),
  }).select("id").single();

  if (articleError) return response({ error: articleError.message }, 500);

  const uniqueSymptomIds = [...new Set(body.symptomIds || [])];
  if (article && uniqueSymptomIds.length > 0) {
    const { error: mapError } = await supabase.from("symptom_disease_map").insert(uniqueSymptomIds.map((symptomId) => ({ symptom_id: symptomId, article_id: article.id })));
    if (mapError) return response({ error: mapError.message }, 500);
  }

  return response({ id: article?.id });
});