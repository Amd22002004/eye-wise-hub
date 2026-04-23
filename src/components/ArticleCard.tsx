import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Article } from "@/data/supabaseContent";

interface Props {
  article: Article;
  index?: number;
}

const ArticleCard = ({ article, index = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    className="h-full"
  >
    <Link
      to={`/article/${article.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
    >
      <span className="text-sm font-medium text-secondary">{article.category}</span>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
        {article.title}
      </h3>
      <p className="text-base sm:text-lg text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</p>
      <div className="mt-auto flex flex-col gap-1 pt-3 border-t border-border/50 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground/80 truncate">{article.author}</span>
          <span>·</span>
          <span className="shrink-0">{article.readTime}</span>
        </div>
        <span className="text-xs text-muted-foreground/70 truncate">{article.authorRole}</span>
      </div>
    </Link>
  </motion.div>
);

export default ArticleCard;