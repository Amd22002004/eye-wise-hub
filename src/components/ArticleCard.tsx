import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Article } from "@/data/mockData";

interface Props {
  article: Article;
  index?: number;
}

const ArticleCard = ({ article, index = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
  >
    <Link
      to={`/article/${article.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
    >
      <span className="text-xs font-medium text-secondary">{article.category}</span>
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
        {article.title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
      <div className="mt-auto flex flex-col gap-1.5 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
        <span className="text-[11px] text-muted-foreground/70">{article.authorRole}</span>
      </div>
    </Link>
  </motion.div>
);

export default ArticleCard;
