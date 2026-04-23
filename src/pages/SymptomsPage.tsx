import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/useContent";

const SymptomsPage = () => {
  const { data } = useContent();
  const symptomArticles = (data?.articles ?? []).filter((a) => a.categorySlug === "symptoms");

  return <div className="container max-w-4xl py-8 sm:py-12 md:py-16">
    <SEO
      title="Симптомы и жалобы — офтальмология"
      description="Описание симптомов заболеваний глаз: боль, покраснение, размытое зрение, мушки, снижение зрения. Связь симптомов с заболеваниями."
    />
    <div className="mb-8 sm:mb-12">
      <h1 className="mb-3">Симптомы и жалобы</h1>
      <p className="text-lg text-muted-foreground">
        Узнайте, о чём могут говорить различные симптомы со стороны глаз, и когда нужно обратиться к врачу
      </p>
    </div>

    <div className="space-y-4 sm:space-y-5">
      {symptomArticles.map((article, i) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
        >
          <Link
            to={`/article/${article.slug}`}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                {article.title}
              </h2>
              <p className="mt-1.5 text-base text-muted-foreground line-clamp-2">{article.excerpt}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>;
};

export default SymptomsPage;
