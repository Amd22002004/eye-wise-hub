import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import SEO from "@/components/SEO";
import { getArticles } from "@/lib/dataProvider";

const ArticlesListPage = () => {
  const [articles, setArticles] = useState([]);

  const loadArticles = async () => {
    const data = await getArticles();
    setArticles(data);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div className="container py-8 sm:py-12 md:py-16">
      <SEO
        title="Все статьи"
        description="Полная коллекция статей по офтальмологии — заболевания глаз, диагностика, лечение и профилактика."
      />
      <h1 className="mb-6 sm:mb-8">Все статьи</h1>
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <ArticleCard key={a.id} article={a} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesListPage;