import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react";
import { articles } from "@/data/mockData";
import ArticleCard from "@/components/ArticleCard";

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

  const related = articles.filter((a) => article.relatedIds.includes(a.id));

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

      <div className="space-y-8">
        {article.sections.map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <h2 className="mb-3">{section.title}</h2>
            <p className="leading-relaxed text-muted-foreground">
              {simpleMode && section.simpleContent ? section.simpleContent : section.content}
            </p>
          </motion.section>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-accent/50 p-5">
        <p className="text-sm font-medium text-foreground">{article.author}</p>
        <p className="text-xs text-muted-foreground">{article.authorRole}</p>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6">Связанные статьи</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
