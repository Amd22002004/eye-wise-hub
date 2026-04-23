import { useEffect, useState } from "react";
import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import ArticleCard from "@/components/ArticleCard";
import SEO from "@/components/SEO";
import { getArticles } from "@/lib/dataProvider";
import type { Article } from "@/data/mockData";

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const loadArticles = async () => {
    const data = await getArticles();
    setArticles(data);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div>
      <SEO
        title="ОфтальмоВики"
        description="Энциклопедия офтальмологии — достоверная медицинская информация для пациентов, студентов и врачей. Статьи, научные публикации, справочные материалы."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ОфтальмоВики",
          alternateName: "Ассоциация офтальмологических клиник",
          description: "Энциклопедия офтальмологии для пациентов и специалистов",
          potentialAction: {
            "@type": "SearchAction",
            target: "/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <HeroSearch />
      <CategoryGrid articles={articles} />
      <section className="container page-section">
        <h2 className="mb-6 sm:mb-8 text-center">Популярные статьи</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;