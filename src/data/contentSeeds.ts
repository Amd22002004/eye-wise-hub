export type SeedKind = "symptom" | "disease" | "diagnostics" | "treatment";

export interface ContentSeed {
  id: string;
  kind: SeedKind;
  slug: string;
  title: string;
  intent: string;
  category: string;
  categorySlug: string;
  subcategorySlug?: string;
  relatedArticleIds: string[];
  relatedSeedIds: string[];
  generateArticle?: boolean;
}

export const seedCategories = [
  { id: "106", slug: "dry-eye", name: "Синдром сухого глаза", description: "Жалобы, диагностика и лечение сухости глаз", articleCount: 1, icon: "💧", parentId: "1" },
  { id: "107", slug: "diabetic-retinopathy", name: "Диабетическая ретинопатия", description: "Поражение сетчатки при сахарном диабете", articleCount: 1, icon: "🩸", parentId: "1" },
  { id: "203", slug: "tonometry", name: "Тонометрия", description: "Измерение внутриглазного давления", articleCount: 1, icon: "📏", parentId: "2" },
  { id: "204", slug: "perimetry", name: "Периметрия", description: "Исследование полей зрения", articleCount: 1, icon: "🎯", parentId: "2" },
  { id: "304", slug: "anti-vegf", name: "Анти-VEGF терапия", description: "Интравитреальные инъекции при заболеваниях сетчатки", articleCount: 1, icon: "💉", parentId: "3" },
  { id: "305", slug: "glaucoma-drops", name: "Гипотензивные капли", description: "Медикаментозное снижение внутриглазного давления", articleCount: 1, icon: "🧴", parentId: "3" },
];

export const contentSeeds: ContentSeed[] = [
  { id: "seed-eye-pain", kind: "symptom", slug: "eye-pain-symptom", title: "Боль в глазах", intent: "Направить пользователя от жалобы на боль к возможным причинам, срочным признакам и связанным заболеваниям.", category: "Симптомы и жалобы", categorySlug: "symptoms", subcategorySlug: "eye-pain", relatedArticleIds: ["s1", "1"], relatedSeedIds: ["seed-biomicroscopy"], generateArticle: false },
  { id: "seed-eye-redness", kind: "symptom", slug: "eye-redness-symptom", title: "Покраснение глаз", intent: "Связать жалобу на красный глаз с воспалением, сухостью, травмой и показаниями к осмотру.", category: "Симптомы и жалобы", categorySlug: "symptoms", subcategorySlug: "eye-redness", relatedArticleIds: ["s2", "s1"], relatedSeedIds: ["seed-dry-eye"], generateArticle: false },
  { id: "seed-blurred-vision", kind: "symptom", slug: "blurred-vision-symptom", title: "Размытое зрение", intent: "Помочь отличить рефракционные причины от катаракты, глаукомы и заболеваний сетчатки.", category: "Симптомы и жалобы", categorySlug: "symptoms", subcategorySlug: "blurred-vision", relatedArticleIds: ["s3", "2", "3"], relatedSeedIds: ["seed-tonometry"], generateArticle: false },
  { id: "seed-floaters", kind: "symptom", slug: "floaters-symptom", title: "Мушки перед глазами", intent: "Объяснить, когда плавающие помутнения безопасны, а когда нужны срочная диагностика и осмотр сетчатки.", category: "Симптомы и жалобы", categorySlug: "symptoms", subcategorySlug: "floaters", relatedArticleIds: ["s4", "4"], relatedSeedIds: ["seed-anti-vegf"], generateArticle: false },
  { id: "seed-vision-loss", kind: "symptom", slug: "vision-loss-symptom", title: "Снижение зрения", intent: "Разделить постепенное и внезапное ухудшение зрения и связать жалобу с диагностикой и заболеваниями.", category: "Симптомы и жалобы", categorySlug: "symptoms", subcategorySlug: "vision-loss", relatedArticleIds: ["s5", "1", "2"], relatedSeedIds: ["seed-perimetry"], generateArticle: false },
  { id: "seed-dry-eye", kind: "disease", slug: "dry-eye-syndrome", title: "Синдром сухого глаза", intent: "Помочь пациенту понять причины сухости, жжения и усталости глаз и выбрать правильный маршрут обследования.", category: "Заболевания глаз", categorySlug: "diseases", subcategorySlug: "dry-eye", relatedArticleIds: ["s1", "s2"], relatedSeedIds: ["seed-biomicroscopy"] },
  { id: "seed-diabetic-retinopathy", kind: "disease", slug: "diabetic-retinopathy", title: "Диабетическая ретинопатия", intent: "Объяснить, почему при диабете нужно регулярно проверять сетчатку и какие признаки требуют срочного визита.", category: "Заболевания глаз", categorySlug: "diseases", subcategorySlug: "diabetic-retinopathy", relatedArticleIds: ["4", "s5"], relatedSeedIds: ["seed-anti-vegf"] },
  { id: "seed-tonometry", kind: "diagnostics", slug: "tonometry-eye-pressure", title: "Тонометрия: измерение глазного давления", intent: "Показать, кому и зачем измеряют внутриглазное давление, особенно при риске глаукомы.", category: "Диагностика", categorySlug: "diagnostics", subcategorySlug: "tonometry", relatedArticleIds: ["1", "s5"], relatedSeedIds: ["seed-glaucoma-drops"] },
  { id: "seed-perimetry", kind: "diagnostics", slug: "visual-field-test-perimetry", title: "Периметрия: проверка полей зрения", intent: "Объяснить роль исследования полей зрения при глаукоме, неврологических и сетчаточных заболеваниях.", category: "Диагностика", categorySlug: "diagnostics", subcategorySlug: "perimetry", relatedArticleIds: ["1", "s5"], relatedSeedIds: ["seed-tonometry"] },
  { id: "seed-biomicroscopy", kind: "diagnostics", slug: "eye-biomicroscopy", title: "Биомикроскопия глаза", intent: "Помочь понять, что врач оценивает на щелевой лампе при боли, покраснении и сухости глаз.", category: "Диагностика", categorySlug: "diagnostics", subcategorySlug: "functional-tests", relatedArticleIds: ["s1", "s2"], relatedSeedIds: ["seed-dry-eye"] },
  { id: "seed-anti-vegf", kind: "treatment", slug: "anti-vegf-eye-injections", title: "Анти-VEGF терапия в офтальмологии", intent: "Сориентировать пациента, когда применяют интравитреальные инъекции и с какими заболеваниями сетчатки они связаны.", category: "Лечение", categorySlug: "treatment", subcategorySlug: "anti-vegf", relatedArticleIds: ["4", "s4", "s5"], relatedSeedIds: ["seed-diabetic-retinopathy"] },
  { id: "seed-glaucoma-drops", kind: "treatment", slug: "glaucoma-eye-drops", title: "Капли при глаукоме", intent: "Объяснить назначение гипотензивных капель и почему важны регулярность лечения и контроль давления.", category: "Лечение", categorySlug: "treatment", subcategorySlug: "glaucoma-drops", relatedArticleIds: ["1", "s1"], relatedSeedIds: ["seed-tonometry", "seed-perimetry"] },
];

export const seedArticles = contentSeeds.filter((seed) => seed.generateArticle !== false).map((seed) => ({
  id: seed.id,
  slug: seed.slug,
  title: seed.title,
  excerpt: seed.intent,
  category: seed.category,
  categorySlug: seed.categorySlug,
  subcategorySlug: seed.subcategorySlug,
  author: "Редакция ОфтальмоВики",
  authorRole: "Редакционный материал",
  date: "2025-04-20",
  readTime: "Структура",
  sections: [],
  relatedIds: [...seed.relatedArticleIds, ...seed.relatedSeedIds],
  seedType: seed.kind,
  contentIntent: seed.intent,
}));