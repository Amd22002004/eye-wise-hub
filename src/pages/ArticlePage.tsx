import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ArrowLeft, Clock, User, List, Sparkles, Heart, GraduationCap, ShieldCheck, Info, CalendarClock } from "lucide-react";
import { articles, MEDICAL_SECTION_LABELS, type MedicalSectionKey, type Article } from "@/data/mockData";
import ArticleCard from "@/components/ArticleCard";

function getRelatedArticles(current: Article, all: Article[], max = 5): Article[] {
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

const ArticlePage = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  const [mode, setMode] = useState<ViewMode>("simple");
  const related = useMemo(() => (article ? getRelatedArticles(article, articles) : []), [article]);

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <h1>Статья не найдена</h1>
        <Link to="/" className="mt-4 inline-block text-secondary hover:underline">← На главную</Link>
      </div>
    );
  }

  const medicalKeys = article.medicalSections
    ? (Object.keys(MEDICAL_SECTION_LABELS) as MedicalSectionKey[]).filter(
        (k) => article.medicalSections?.[k]
      )
    : [];

  const hasMedical = medicalKeys.length > 0;
  const hasDualContent = hasMedical;

  const tocItems = hasMedical
    ? medicalKeys.map((k) => ({ id: `section-${k}`, label: MEDICAL_SECTION_LABELS[k] }))
    : article.sections.map((s, i) => ({ id: `section-${i}`, label: s.title }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container max-w-3xl py-8 sm:py-12 md:py-16"
    >
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
          ? medicalKeys.map((key, i) => {
              const section = article.medicalSections![key]!;
              const text = section[mode];
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
                      className="prose-medical"
                    >
                      <p>{text}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.section>
              );
            })
          : article.sections.map((section, i) => (
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
            ))}
      </div>

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

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <div className="mb-5 sm:mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h2 className="mb-0">Связанные статьи</h2>
          </div>
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default ArticlePage;