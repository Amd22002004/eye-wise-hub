import { supabase } from "@/integrations/supabase/client";
import { articles, categories } from "@/data/mockData";

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
  return data;
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
