import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getChildCategories } from "@/data/supabaseContent";
import ArticleCard from "@/components/ArticleCard";
import CategoryGrid from "@/components/CategoryGrid";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/useContent";

const CategoriesPage = () => {
  const { slug } = useParams();
  const { data } = useContent();
  const articles = data?.articles ?? [];
  const categories = data?.categories ?? [];

  if (!slug) {
    return (
      <div className="py-8 sm:py-12 md:py-16">
        <SEO title="Разделы" description="Все разделы энциклопедии офтальмологии — заболевания, диагностика, лечение и профилактика." />
        <h1 className="mb-8 sm:mb-10 text-center">Все разделы</h1>
        <CategoryGrid />
      </div>
    );
  }

  const category = getCategoryBySlug(categories, slug);
  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1>Раздел не найден</h1>
        <Link to="/categories" className="mt-4 inline-block text-secondary hover:underline">← Все разделы</Link>
      </div>
    );
  }

  const children = getChildCategories(categories, category.id);
  const parent = category.parentId ? categories.find((c) => c.id === category.parentId) : null;

  const relevantSlugs = [category.slug, ...children.map((c) => c.slug)];
  const filtered = articles.filter(
    (a) => a.categorySlug === category.slug || a.subcategorySlug === category.slug || relevantSlugs.includes(a.categorySlug) || relevantSlugs.includes(a.subcategorySlug ?? "")
  );

  return (
    <div className="container py-8 sm:py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-5 sm:mb-6 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
        <Link to="/categories" className="hover:text-foreground transition-colors">Разделы</Link>
        {parent && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/categories/${parent.slug}`} className="hover:text-foreground transition-colors">{parent.name}</Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{category.icon}</span>
        <h1 className="mb-0">{category.name}</h1>
      </div>
      <p className="mb-8 sm:mb-10 text-sm sm:text-base text-muted-foreground">{category.description}</p>

      {/* Subcategories */}
      {children.length > 0 && (
        <div className="mb-8 sm:mb-10">
          <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Подразделы</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child, i) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Link
                  to={`/categories/${child.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:card-shadow"
                >
                  <span className="text-lg">{child.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{child.name}</span>
                    <p className="text-xs text-muted-foreground truncate">{child.description}</p>
                  </div>
                  <span className="text-xs text-secondary font-medium">{child.articleCount}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Статьи в этой категории скоро появятся.</p>
      ) : (
        <>
          <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Статьи</h3>
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesPage;