import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/mockData";

const Index = () => (
  <div>
    <HeroSearch />
    <CategoryGrid />
    <section className="container pb-20">
      <h2 className="mb-8 text-center">Популярные статьи</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 4).map((a, i) => (
          <ArticleCard key={a.id} article={a} index={i} />
        ))}
      </div>
    </section>
  </div>
);

export default Index;
