import { supabase } from "@/integrations/supabase/client";
import { articles, categories } from "@/data/mockData";

const mapArticle = (item: any) => ({
  ...item,
  medicalSections: item.content_json || item.medicalSections || {},
  sections: item.sections || [],
  relatedIds: item.relatedIds || [],
});

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
