import { createClient } from "npm:@supabase/supabase-js@2.104.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2.104.0/cors";

type SectionKey = "definition" | "causes" | "symptoms" | "diagnosis" | "treatment" | "prevention";
type ArticleSeed = { slug: string; title: string; categorySlug: string; subcategorySlug: string; sections: SectionKey[] };

const seeds: ArticleSeed[] = [
  { slug: "what-is-ophthalmology", title: "Что такое офтальмология", categorySlug: "general-info", subcategorySlug: "what-is-ophthalmology", sections: ["definition", "diagnosis", "treatment", "prevention"] },
  { slug: "eye-anatomy", title: "Анатомия и физиология глаза", categorySlug: "general-info", subcategorySlug: "eye-anatomy", sections: ["definition", "diagnosis", "prevention"] },
  { slug: "visual-analyzer", title: "Зрительный анализатор", categorySlug: "general-info", subcategorySlug: "visual-analyzer", sections: ["definition", "symptoms", "diagnosis", "prevention"] },
  { slug: "age-vision", title: "Возрастные особенности зрения", categorySlug: "general-info", subcategorySlug: "age-vision", sections: ["definition", "symptoms", "diagnosis", "prevention"] },
  { slug: "glaucoma", title: "Глаукома", categorySlug: "diseases", subcategorySlug: "glaucoma-cat", sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"] },
  { slug: "cataract", title: "Катаракта", categorySlug: "diseases", subcategorySlug: "cataract-cat", sections: ["definition", "symptoms", "treatment"] },
  { slug: "retinal-diseases", title: "Заболевания сетчатки", categorySlug: "diseases", subcategorySlug: "retina", sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"] },
  { slug: "corneal-diseases", title: "Заболевания роговицы", categorySlug: "diseases", subcategorySlug: "cornea", sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"] },
  { slug: "refractive-errors", title: "Аномалии рефракции", categorySlug: "diseases", subcategorySlug: "refraction", sections: ["definition", "causes", "symptoms", "diagnosis", "treatment", "prevention"] },
  { slug: "eye-imaging", title: "Визуализация в офтальмологии", categorySlug: "diagnostics", subcategorySlug: "imaging", sections: ["definition", "diagnosis", "treatment", "prevention"] },
  { slug: "functional-eye-tests", title: "Функциональные тесты зрения", categorySlug: "diagnostics", subcategorySlug: "functional-tests", sections: ["definition", "diagnosis", "prevention"] },
  { slug: "eye-surgery", title: "Хирургия глаза", categorySlug: "treatment", subcategorySlug: "surgery", sections: ["definition", "diagnosis", "treatment", "prevention"] },
  { slug: "laser-eye-treatment", title: "Лазерное лечение глаз", categorySlug: "treatment", subcategorySlug: "laser", sections: ["definition", "diagnosis", "treatment", "prevention"] },
  { slug: "ophthalmic-pharmacology", title: "Фармакотерапия в офтальмологии", categorySlug: "treatment", subcategorySlug: "pharmacology", sections: ["definition", "diagnosis", "treatment", "prevention"] },
  { slug: "vision-prevention", title: "Профилактика нарушений зрения", categorySlug: "prevention", subcategorySlug: "prevention", sections: ["definition", "causes", "symptoms", "diagnosis", "prevention"] },
];

const templates: Record<SectionKey, (title: string) => { simple: string; professional: string }> = {
  definition: (title) => ({ simple: `${title} — важная тема офтальмологии, которая помогает понять, как устроено зрение и какие изменения требуют внимания врача. Материал написан для первичной ориентации пациента.`, professional: `${title}: структурированное описание офтальмологического состояния или направления с акцентом на анатомический субстрат, клиническую значимость, влияние на зрительные функции и риск прогрессирования.` }),
  causes: (title) => ({ simple: `Причины, связанные с темой «${title}», могут зависеть от возраста, наследственности, зрительной нагрузки, хронических заболеваний, травм и воспаления. Точную причину определяют после осмотра.`, professional: `${title}: этиологическая оценка включает анамнез, системные факторы риска, лекарственную нагрузку, данные биомикроскопии, офтальмоскопии и инструментальных методов по показаниям.` }),
  symptoms: (title) => ({ simple: `Возможны снижение чёткости зрения, дискомфорт, покраснение, боль, искажение изображения или появление помутнений. Новые, резкие или нарастающие жалобы требуют очной консультации.`, professional: `${title}: клинические проявления оценивают по остроте зрения, полям зрения, болевому синдрому, воспалительным признакам, состоянию переднего и заднего отрезка, а также динамике симптомов.` }),
  diagnosis: (title) => ({ simple: `Диагностика обычно включает проверку зрения, осмотр на щелевой лампе и оценку глазного дна. По показаниям проводят тонометрию, ОКТ, периметрию, УЗИ или другие исследования.`, professional: `${title}: диагностический маршрут строится на визометрии, биомикроскопии, офтальмоскопии и таргетированных инструментальных тестах. Объём обследования зависит от предполагаемой нозологии и риска осложнений.` }),
  treatment: (title) => ({ simple: `Лечение подбирают по причине и выраженности изменений. Это может быть наблюдение, капли, очковая коррекция, лазерная процедура, инъекции или операция. Самолечение небезопасно.`, professional: `${title}: терапевтическая тактика определяется диагнозом, стадией, функциональными нарушениями и профилем риска. Возможны фармакотерапия, лазерные методы, микрохирургия или комбинированный подход.` }),
  prevention: (title) => ({ simple: `Профилактика включает регулярные осмотры, защиту глаз от травм, контроль хронических заболеваний и обращение к врачу при изменении зрения. Частота осмотров зависит от возраста и факторов риска.`, professional: `${title}: профилактика основана на стратификации риска, диспансерном наблюдении, контроле системных факторов, коррекции нагрузки и обучении пациента признакам, требующим срочного осмотра.` }),
};

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return response({ error: "Missing backend credentials" }, 500);

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const [{ data: categories, error: categoriesError }, { data: existing, error: existingError }] = await Promise.all([
    supabase.from("categories").select("id, slug"),
    supabase.from("articles").select("slug"),
  ]);

  if (categoriesError || existingError) return response({ error: categoriesError?.message || existingError?.message }, 500);

  const categoryBySlug = new Map((categories || []).map((category) => [category.slug, category.id]));
  const existingSlugs = new Set((existing || []).map((article) => article.slug));
  const rows = seeds
    .filter((seed) => !existingSlugs.has(seed.slug))
    .map((seed) => ({
      slug: seed.slug,
      title: seed.title,
      excerpt: `${seed.title}: структурированная медицинская статья для пациентов и специалистов.`,
      read_time: Math.max(3, seed.sections.length * 2),
      status: "published",
      category_id: categoryBySlug.get(seed.categorySlug) ?? null,
      subcategory_id: categoryBySlug.get(seed.subcategorySlug) ?? null,
      content_json: Object.fromEntries(seed.sections.map((section) => [section, templates[section](seed.title)])),
    }))
    .filter((row) => row.category_id && row.subcategory_id);

  if (rows.length === 0) return response({ inserted: 0, skipped: seeds.length });

  const { error } = await supabase.from("articles").insert(rows);
  if (error) return response({ error: error.message }, 500);

  return response({ inserted: rows.length, skipped: seeds.length - rows.length });
});
