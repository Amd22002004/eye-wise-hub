import HeroSearch from "@/components/HeroSearch";
import CategoryGrid from "@/components/CategoryGrid";
import ArticleCard from "@/components/ArticleCard";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/useContent";

const Index = () => {
  const { data } = useContent();
  const articles = data?.articles ?? [];

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
      <CategoryGrid />
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