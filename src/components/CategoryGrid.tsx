import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getRootCategories, getChildCategories } from "@/data/mockData";

// Sections that have dedicated pages instead of generic /categories/:slug
const DEDICATED_ROUTES: Record<string, string> = {
  "general-info": "/general-info",
  "research": "/scientific",
  "dissertations": "/dissertations",
  "doctors": "/doctors",
  "modern-directions": "/modern-directions",
};

const CategoryGrid = () => {
  const roots = getRootCategories();

  return (
    <section className="container pb-12 sm:pb-16 md:pb-20">
      <h2 className="mb-6 sm:mb-8 text-center">Разделы энциклопедии</h2>
      <div className="space-y-4 sm:space-y-5">
        {roots.map((cat, i) => {
          const children = getChildCategories(cat.id);
          const href = DEDICATED_ROUTES[cat.slug] || `/categories/${cat.slug}`;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
            >
              <Link
                to={href}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
              >
                <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {cat.name}
                  </span>
                  <p className="text-base sm:text-lg text-muted-foreground mt-1.5 line-clamp-2">{cat.description}</p>
                  {children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          to={`/categories/${child.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 sm:px-3.5 py-1.5 sm:py-2 text-sm font-medium text-accent-foreground hover:bg-muted transition-colors duration-200"
                        >
                          <span>{child.icon}</span>
                          {child.name}
                          <span className="text-muted-foreground ml-0.5 sm:ml-1">{child.articleCount}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-sm sm:text-base font-medium text-secondary">{cat.articleCount} статей</span>
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
