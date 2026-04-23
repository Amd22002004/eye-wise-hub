import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Check, Stethoscope } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getSymptomSearchData, type SymptomSearchData } from "@/lib/dataProvider";

const SymptomsPage = () => {
  const [searchData, setSearchData] = useState<SymptomSearchData>({ symptoms: [], articles: [], mappings: [] });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const loadSearchData = async () => {
    const data = await getSymptomSearchData();
    setSearchData(data);
  };

  useEffect(() => {
    loadSearchData();
  }, []);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptomId) ? current.filter((id) => id !== symptomId) : [...current, symptomId],
    );
  };

  const rankedArticles = useMemo(() => {
    if (selectedSymptoms.length === 0) return [];

    const selected = new Set(selectedSymptoms);
    const matchCountByArticle = searchData.mappings.reduce<Record<string, number>>((acc, mapping) => {
      if (selected.has(mapping.symptomId)) {
        acc[mapping.articleId] = (acc[mapping.articleId] || 0) + 1;
      }
      return acc;
    }, {});

    return searchData.articles
      .map((article) => ({ article, matchCount: matchCountByArticle[article.id] || 0 }))
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount || a.article.title.localeCompare(b.article.title));
  }, [searchData.articles, searchData.mappings, selectedSymptoms]);

  const likelyResults = rankedArticles.filter((item) => item.matchCount >= Math.max(2, selectedSymptoms.length));
  const lessCommonResults = rankedArticles.filter((item) => !likelyResults.includes(item));
  const hasSelection = selectedSymptoms.length > 0;
  const symptomArticles = searchData.articles.filter((article) => article.categorySlug === "symptoms");

  return (
    <div className="container max-w-5xl py-8 sm:py-12 md:py-16">
      <SEO
        title="Симптомы и жалобы — офтальмология"
        description="Описание симптомов заболеваний глаз: боль, покраснение, размытое зрение, мушки, снижение зрения. Связь симптомов с заболеваниями."
      />
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-3">Симптомы и жалобы</h1>
        <p className="text-lg text-muted-foreground">
          Узнайте, о чём могут говорить различные симптомы со стороны глаз, и когда нужно обратиться к врачу
        </p>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-2">
          <TabsTrigger value="articles">Симптомы и статьи</TabsTrigger>
          <TabsTrigger value="search">Подбор по симптомам</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-0">
          <div className="space-y-4 sm:space-y-5">
            {symptomArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {article.title}
                    </h2>
                    <p className="mt-1.5 text-base text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Выберите симптомы</h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {searchData.symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary hover:bg-accent",
                  )}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                  {symptom.name}
                </button>
              );
            })}
          </div>

          {selectedSymptoms.length > 0 && (
            <Button variant="ghost" className="mt-5" onClick={() => setSelectedSymptoms([])}>
              Сбросить выбор
            </Button>
          )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <Stethoscope className="h-5 w-5 text-secondary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Возможные диагнозы</h2>
          </div>

          {!hasSelection ? (
            <div className="rounded-xl border border-dashed border-border bg-background p-6 text-muted-foreground">
              Выберите симптомы
            </div>
          ) : rankedArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background p-6 text-muted-foreground">
              Ничего не найдено
            </div>
          ) : (
            <div className="space-y-6">
              {likelyResults.length > 0 && <ResultGroup title="Наиболее вероятно" items={likelyResults} />}
              {lessCommonResults.length > 0 && <ResultGroup title="Реже встречается" items={lessCommonResults} />}
            </div>
          )}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

type ResultGroupProps = {
  title: string;
  items: Array<{ article: SymptomSearchData["articles"][number]; matchCount: number }>;
};

const ResultGroup = ({ title, items }: ResultGroupProps) => (
  <div>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-normal text-muted-foreground">{title}</h3>
    <div className="space-y-3">
      {items.map(({ article, matchCount }, i) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          className="rounded-xl border border-border bg-background p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="text-lg font-semibold text-foreground">{article.title}</h4>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
              <p className="mt-2 text-xs text-muted-foreground">Совпадений: {matchCount}</p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link to={`/article/${article.slug}`}>Читать</Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SymptomsPage;
