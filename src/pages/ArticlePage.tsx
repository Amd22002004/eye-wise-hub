import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Clock, User, List, Heart, GraduationCap, ShieldCheck, Info, CalendarClock, Sparkles, Stethoscope, Pill, Search, Rocket } from "lucide-react";
import { MEDICAL_SECTION_LABELS, type MedicalSectionKey, type Article } from "@/data/mockData";
import ArticleCard from "@/components/ArticleCard";
import SEO from "@/components/SEO";
import { getArticles } from "@/lib/dataProvider";
import { getSeoIntentPath, isSeoIntentSlug, seoIntentBySlug, seoIntentSlugs, seoSectionByIntentSlug, type SeoIntentSlug } from "@/seo/seoTypes";
import { getContextualLinkRules, getNextStepLinks, getRelatedDiseases, getSameConditionLinks, getSymptomDiseaseLinks, type ContextualLinkRule, type InternalLinkItem } from "@/seo/internalLinks";

// Modern directions data for inline links
const MODERN_DIRECTION_LINKS = [
  { keywords: ["ИИ", "искусственн", "алгоритм", "нейронн", "глубокого обучения", "скрининг"], id: "ai", label: "ИИ в офтальмологии" },
  { keywords: ["генн", "генетич", "CRISPR", "мутац", "наследствен"], id: "genetics", label: "Генетика в офтальмологии" },
  { keywords: ["телемедицин", "дистанционн", "мобильн", "портативн"], id: "telemedicine", label: "Телемедицина" },
  { keywords: ["робот", "бионич", "имплант", "sustained-release", "нанотехнолог"], id: "new-tech", label: "Новые технологии" },
];

function getRelatedArticles(current: Article, all: Article[], max = 6): Article[] {
  const keywords = extractKeywords(current.title + " " + current.excerpt);
  const scored = all
    .filter((a) => a.id !== current.id)
    .map((a) => {
      let score = 0;
      if (a.categorySlug === current.categorySlug) score += 3;
      if (current.subcategorySlug && a.subcategorySlug === current.subcategorySlug) score += 4;
      if (current.relatedIds.includes(a.id)) score += 5;
      const otherKw = extractKeywords(a.title + " " + a.excerpt);
      const overlap = keywords.filter((k) => otherKw.includes(k)).length;
      score += overlap * 2;
      return { article: a, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
  return scored.map((r) => r.article);
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(["и", "в", "на", "с", "по", "для", "от", "к", "из", "при", "это", "как", "что", "или"]);
  return text
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));
}

type ViewMode = "simple" | "professional";

const SEO_INTENT_TITLES: Record<SeoIntentSlug, (title: string) => string> = {
  overview: (title) => title,
  symptoms: (title) => `${title} — симптомы, признаки и лечение`,
  treatment: (title) => `${title} — лечение и современные методы`,
  causes: (title) => `${title} — причины и факторы риска`,
  diagnosis: (title) => `${title} — диагностика и обследования`,
  prevention: (title) => `${title} — профилактика и контроль риска`,
};

const SEO_INTENT_DESCRIPTIONS: Record<SeoIntentSlug, (title: string) => string> = {
  overview: (title) => `Подробно о заболевании ${title.toLowerCase()}: что это, как проявляется, как диагностируется и лечится.`,
  symptoms: (title) => `Подробно о симптомах ${title.toLowerCase()}: как распознать заболевание и когда обращаться к врачу.`,
  treatment: (title) => `Методы лечения ${title.toLowerCase()}: капли, лазерные процедуры, операции и контроль результата.`,
  causes: (title) => `Причины ${title.toLowerCase()} и факторы риска: что влияет на развитие заболевания.`,
  diagnosis: (title) => `Диагностика ${title.toLowerCase()}: какие обследования проводит офтальмолог и зачем они нужны.`,
  prevention: (title) => `Профилактика ${title.toLowerCase()}: контроль факторов риска, наблюдение и регулярные осмотры.`,
};

interface RelationGroup {
  type: "disease" | "treatment" | "diagnostics" | "symptoms";
  label: string;
  icon: typeof Stethoscope;
  articles: Article[];
}

function categorizeRelated(related: Article[]): RelationGroup[] {
  const groups: RelationGroup[] = [
    { type: "disease", label: "Похожие заболевания", icon: Stethoscope, articles: [] },
    { type: "treatment", label: "Методы лечения", icon: Pill, articles: [] },
    { type: "diagnostics", label: "Диагностика", icon: Search, articles: [] },
    { type: "symptoms", label: "Симптомы", icon: Info, articles: [] },
  ];
  for (const a of related) {
    if (a.seedType === "symptom" || a.categorySlug === "symptoms") groups[3].articles.push(a);
    else if (a.seedType === "diagnostics" || a.categorySlug === "diagnostics") groups[2].articles.push(a);
    else if (a.seedType === "treatment" || a.categorySlug === "treatment") groups[1].articles.push(a);
    else groups[0].articles.push(a);
  }
  return groups.filter((g) => g.articles.length > 0);
}

function getRelevantDirections(article: Article): { id: string; label: string }[] {
  const text = (article.title + " " + article.excerpt + " " +
    (article.medicalSections ? Object.values(article.medicalSections).map(s => s ? `${s.simple || ""} ${s.professional || ""}` : "").join(" ") : "") +
    (article.sections || []).map(s => s.content).join(" ")
  ).toLowerCase();
  return MODERN_DIRECTION_LINKS.filter(d => d.keywords.some(k => text.includes(k.toLowerCase())));
}

const renderContextualText = (text: string, rules: ContextualLinkRule[]) => {
  const parts: (string | { phrase: string; to: string })[] = [text];
  let inserted = 0;

  for (const rule of rules) {
    if (inserted >= 3) break;
    const index = parts.findIndex((part) => typeof part === "string" && part.toLowerCase().includes(rule.phrase.toLowerCase()));
    if (index === -1) continue;

    const value = parts[index] as string;
    const phraseIndex = value.toLowerCase().indexOf(rule.phrase.toLowerCase());
    parts.splice(
      index,
      1,
      value.slice(0, phraseIndex),
      { phrase: value.slice(phraseIndex, phraseIndex + rule.phrase.length), to: rule.to },
      value.slice(phraseIndex + rule.phrase.length)
    );
    inserted += 1;
  }

  return parts.filter(Boolean).map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <Link key={`${part.to}-${index}`} to={part.to} className="text-primary underline underline-offset-4 hover:text-secondary transition-colors duration-200">
        {part.phrase}
      </Link>
    )
  );
};

const InlineLinkList = ({ items }: { items: InternalLinkItem[] }) => (
  <div className="mt-4 flex flex-wrap gap-2">
    {items.map((item) => (
      <Link key={`${item.to}-${item.label}`} to={item.to} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
        {item.label}
      </Link>
    ))}
  </div>
);

const ArticlePage = () => {
  const { slug, intent } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [mode, setMode] = useState<ViewMode>("simple");
  const article = articles.length > 0 ? articles.find((a) => a.slug === slug) : undefined;
  const activeIntent = isSeoIntentSlug(intent) ? intent : "overview";
  const activeSection = seoSectionByIntentSlug[activeIntent];
  const related = useMemo(() => (article ? getRelatedArticles(article, articles) : []), [article, articles]);
  const relationGroups = useMemo(() => categorizeRelated(related), [related]);
  const modernLinks = useMemo(() => (article ? getRelevantDirections(article) : []), [article]);

  const getContent = (section?: Partial<{ simple: string; professional: string }>) => {
    if (!section) return "";
    const content = mode === "simple" ? section.simple : section.professional;
    return typeof content === "string" ? content : "";
  };

  const loadArticles = async () => {
    const data = await getArticles();
    setArticles(data as Article[]);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  if (!articles || articles.length === 0) {
    return <div className="container py-10 text-center text-muted-foreground">Загрузка статьи...</div>;
  }

  if (!article) {
    return (
      <div className="container py-10 text-center text-muted-foreground">Статья не найдена</div>
    );
  }

  const medicalKeys = article.medicalSections
    ? (Object.keys(MEDICAL_SECTION_LABELS) as MedicalSectionKey[]).filter(
        (k) => Boolean(getContent(article.medicalSections?.[k]))
      )
    : [];

  const orderedMedicalKeys =
    activeIntent !== "overview" && medicalKeys.includes(activeSection)
      ? [activeSection, ...medicalKeys.filter((key) => key !== activeSection)]
      : medicalKeys;

  const hasMedical = medicalKeys.length > 0;
  const hasDualContent = hasMedical;
  const seoTitle = SEO_INTENT_TITLES[activeIntent](article.title);
  const seoDescription = SEO_INTENT_DESCRIPTIONS[activeIntent](article.title);
  const availableSeoLinks = seoIntentSlugs.filter((intentSlug) =>
    intentSlug === "overview" ? true : medicalKeys.includes(seoSectionByIntentSlug[intentSlug])
  );

  const tocItems = hasMedical
    ? orderedMedicalKeys.map((k) => ({ id: `section-${k}`, label: MEDICAL_SECTION_LABELS[k] }))
    : (article.sections || []).map((s, i) => ({ id: `section-${i}`, label: s.title }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container max-w-3xl py-8 sm:py-12 md:py-16"
    >
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: seoTitle,
          description: seoDescription,
          author: { "@type": "Person", name: article.author, jobTitle: article.authorRole },
          dateModified: article.date,
          medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
        }}
      />
      <Link to="/" className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>

      <span className="mb-3 inline-block rounded-lg bg-accent px-3 py-1 text-[11px] sm:text-xs font-medium text-accent-foreground">
        {article.category}
      </span>
      <h1 className="mb-5">{article.title}</h1>

      {/* Meta row */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />{article.author}</span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />{article.authorRole}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />{article.readTime}</span>
        <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Обновлено: {article.date}</span>
      </div>

      {/* Medical disclaimer */}
      <div className="mb-8 sm:mb-10 flex items-start gap-2.5 rounded-xl bg-accent/60 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Информация носит ознакомительный характер и не заменяет консультацию врача.
        </p>
      </div>

      {availableSeoLinks.length > 1 && (
        <nav className="mb-8 sm:mb-10 flex flex-wrap gap-2" aria-label="Разделы статьи">
          {availableSeoLinks.map((intentSlug) => (
            <Link
              key={intentSlug}
              to={getSeoIntentPath(article.slug, intentSlug)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                activeIntent === intentSlug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {intentSlug === "overview" ? article.title : `${MEDICAL_SECTION_LABELS[seoSectionByIntentSlug[intentSlug]]} ${article.title.toLowerCase()}`}
            </Link>
          ))}
        </nav>
      )}

      {/* Dual-layer toggle */}
      {hasDualContent && (
        <div className="mb-8 sm:mb-10 rounded-2xl border border-border bg-card p-1.5 card-shadow inline-flex gap-1">
          <button
            onClick={() => setMode("simple")}
            className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
              mode === "simple"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Heart className="h-4 w-4" />
            Для пациентов
          </button>
          <button
            onClick={() => setMode("professional")}
            className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
              mode === "professional"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Для специалистов
          </button>
        </div>
      )}

      {/* Table of contents */}
      {tocItems.length > 1 && (
        <nav className="mb-10 sm:mb-12 rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <List className="h-4 w-4 text-secondary" />
            Содержание
          </div>
          <ol className="space-y-1.5 pl-1">
            {tocItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-200"
                >
                  {i + 1}. {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Article content */}
      <div className="space-y-8 sm:space-y-10">
        {hasMedical
          ? orderedMedicalKeys.map((key, i) => {
              const section = article.medicalSections![key]!;
              const text = getContent(section);
              return (
                <motion.section
                  key={key}
                  id={`section-${key}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="scroll-mt-24"
                >
                  <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground">
                    {MEDICAL_SECTION_LABELS[key]}
                  </h2>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={`prose-medical transition-all duration-200 ${
                        mode === "simple" ? "text-base sm:text-lg leading-relaxed" : "text-sm sm:text-base leading-normal"
                      }`}
                    >
                      <p>{text}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.section>
              );
            })
            : (article.sections || []).length > 0 ? (article.sections || []).map((section, i) => (
              <motion.section
                key={i}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="scroll-mt-24"
              >
                <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground">{section.title}</h2>
                <div className="prose-medical">
                  <p>{section.content}</p>
                </div>
              </motion.section>
            )) : (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow"
              >
                <h2 className="mb-3 text-lg sm:text-xl font-semibold text-foreground">Структура страницы</h2>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Эта страница создана из seed: URL, категория и связи уже настроены, а полный текст можно добавить вручную без дублирования контента.
                </p>
                {article.contentIntent && (
                  <div className="rounded-xl bg-accent px-4 py-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Пользовательский интент</p>
                    <p className="mt-1 text-sm text-foreground">{article.contentIntent}</p>
                  </div>
                )}
              </motion.section>
            )}
      </div>

      {/* Modern directions links */}
      {modernLinks.length > 0 && (
        <div className="mt-8 sm:mt-10 rounded-2xl border border-border bg-gradient-to-br from-card to-accent/30 p-5 sm:p-6 card-shadow">
          <div className="mb-3 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Современные направления</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Связанные инновации и технологии:</p>
          <div className="flex flex-wrap gap-2">
            {modernLinks.map((d) => (
              <Link
                key={d.id}
                to={`/modern-directions#${d.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors duration-200"
              >
                <Rocket className="h-3 w-3" />
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author card */}
      <div className="mt-10 sm:mt-12 rounded-2xl border border-border bg-accent/50 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {article.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{article.author}</p>
            <p className="text-xs text-secondary">{article.authorRole}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Последнее обновление: {article.date}</p>
      </div>

      {/* Related materials — categorized */}
      {relationGroups.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="mb-5 sm:mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h2 className="mb-0">Связанные материалы</h2>
          </div>
          <div className="space-y-6">
            {relationGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.type}>
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
                  </div>
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.articles.map((a, i) => (
                      <ArticleCard key={a.id} article={a} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default ArticlePage;