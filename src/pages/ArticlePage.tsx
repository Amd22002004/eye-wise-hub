import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { ArrowLeft, Clock, User, BookOpen, List, Sparkles } from "lucide-react";
import { articles, MEDICAL_SECTION_LABELS, MedicalSections, type Article } from "@/data/mockData";
import ArticleCard from "@/components/ArticleCard";

/** Score and return top 3–5 related articles by category, subcategory, and keyword overlap. */
function getRelatedArticles(current: Article, all: Article[], max = 5): Article[] {
  const keywords = extractKeywords(current.title + " " + current.excerpt);

  const scored = all
    .filter((a) => a.id !== current.id)
    .map((a) => {
      let score = 0;
      // Same main category
      if (a.categorySlug === current.categorySlug) score += 3;
      // Same subcategory
      if (current.subcategorySlug && a.subcategorySlug === current.subcategorySlug) score += 4;
      // Manually linked
      if (current.relatedIds.includes(a.id)) score += 5;
      // Keyword overlap
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

const ArticlePage = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  const [simpleMode, setSimpleMode] = useState(false);

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <h1>Статья не найдена</h1>
        <Link to="/" className="mt-4 inline-block text-secondary hover:underline">← На главную</Link>
      </div>
    );
  }
  const related = useMemo(() => getRelatedArticles(article, articles), [article]);

  // Build TOC from medical sections + legacy sections
  const medicalKeys = article.medicalSections
    ? (Object.keys(MEDICAL_SECTION_LABELS) as (keyof MedicalSections)[]).filter(
        (k) => article.medicalSections?.[k]
      )
    : [];

  const hasMedical = medicalKeys.length > 0;

  const tocItems = hasMedical
    ? medicalKeys.map((k) => ({ id: `section-${k}`, label: MEDICAL_SECTION_LABELS[k] }))
    : article.sections.map((s, i) => ({ id: `section-${i}`, label: s.title }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container max-w-3xl py-10"
    >
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>

      <span className="mb-3 inline-block rounded-lg bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
        {article.category}
      </span>
      <h1 className="mb-4">{article.title}</h1>

      <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{article.author}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.readTime}</span>
        <span>{article.date}</span>
      </div>

      {/* Simple / Professional toggle */}
      {article.sections.some((s) => s.simpleContent) && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 card-shadow">
          <BookOpen className="h-5 w-5 shrink-0 text-secondary" />
          <span className="text-sm text-muted-foreground">Режим:</span>
          <button
            onClick={() => setSimpleMode(false)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${!simpleMode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
          >
            Профессиональный
          </button>
          <button
            onClick={() => setSimpleMode(true)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${simpleMode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
          >
            Простой
          </button>
        </div>
      )}

      {/* Table of contents */}
      {tocItems.length > 1 && (
        <nav className="mb-10 rounded-2xl border border-border bg-card p-6 card-shadow">
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
      <div className="space-y-10">
        {hasMedical
          ? medicalKeys.map((key, i) => (
              <motion.section
                key={key}
                id={`section-${key}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="scroll-mt-24"
              >
                <h2 className="mb-3 text-xl font-semibold text-foreground">
                  {MEDICAL_SECTION_LABELS[key]}
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {article.medicalSections![key]}
                </p>
              </motion.section>
            ))
          : article.sections.map((section, i) => (
              <motion.section
                key={i}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="scroll-mt-24"
              >
                <h2 className="mb-3 text-xl font-semibold text-foreground">{section.title}</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {simpleMode && section.simpleContent ? section.simpleContent : section.content}
                </p>
              </motion.section>
            ))}
      </div>

      {/* Author card */}
      <div className="mt-10 rounded-2xl border border-border bg-accent/50 p-5">
        <p className="text-sm font-medium text-foreground">{article.author}</p>
        <p className="text-xs text-muted-foreground">{article.authorRole}</p>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h2 className="mb-0">Связанные статьи</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
