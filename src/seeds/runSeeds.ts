import { supabase } from "@/integrations/supabase/client";
import { articleSeeds } from "@/seeds/articlesSeeds";
import { generateArticle } from "@/lib/generateArticle";

const getReadTimeMinutes = (readTime: string) => {
  const minutes = Number.parseInt(readTime, 10);
  return Number.isNaN(minutes) ? null : minutes;
};

export const runArticleSeeds = async () => {
  for (const seed of articleSeeds) {
    const article = generateArticle(seed);

    const { data: existingArticle, error: lookupError } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", article.slug)
      .maybeSingle();

    if (lookupError) {
      console.error(`Seed lookup failed for slug: ${article.slug}`, lookupError);
      continue;
    }

    if (existingArticle) {
      console.log(`Seed skipped, article already exists: ${article.slug}`);
      continue;
    }

    const { error: insertError } = await supabase.from("articles").insert({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      read_time: getReadTimeMinutes(article.readTime),
      status: "published",
      content_json: article.medicalSections || {},
    });

    if (insertError) {
      console.error(`Seed insert failed for slug: ${article.slug}`, insertError);
      continue;
    }

    console.log(`Seed inserted: ${article.slug}`);
  }
};
