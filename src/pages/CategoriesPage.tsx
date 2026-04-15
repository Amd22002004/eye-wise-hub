import { useParams } from "react-router-dom";
import { categories, articles } from "@/data/mockData";
import ArticleCard from "@/components/ArticleCard";
import CategoryGrid from "@/components/CategoryGrid";

const CategoriesPage = () => {
  const { slug } = useParams();

  if (!slug) {
    return (
      <div className="py-10">
        <h1 className="mb-10 text-center">Все разделы</h1>
        <CategoryGrid />
      </div>
    );
  }

  const category = categories.find((c) => c.slug === slug);
  const filtered = articles.filter((a) => a.categorySlug === slug);

  return (
    <div className="container py-10">
      <h1 className="mb-2">{category?.name ?? slug}</h1>
      <p className="mb-8 text-muted-foreground">{category?.description}</p>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Статьи в этой категории скоро появятся.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
