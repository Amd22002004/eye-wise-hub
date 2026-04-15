import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { categories, getRootCategories, getChildCategories } from "@/data/mockData";

const CategoryGrid = () => {
  const roots = getRootCategories();

  return (
    <section className="container pb-20">
      <h2 className="mb-8 text-center">Разделы энциклопедии</h2>
      <div className="space-y-6">
        {roots.map((cat, i) => {
          const children = getChildCategories(cat.id);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
              >
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {cat.name}
                  </span>
                  <p className="text-sm text-muted-foreground mt-0.5">{cat.description}</p>
                  {children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          to={`/categories/${child.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-muted transition-colors duration-200"
                        >
                          <span>{child.icon}</span>
                          {child.name}
                          <span className="text-muted-foreground ml-1">{child.articleCount}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-secondary">{cat.articleCount} статей</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
