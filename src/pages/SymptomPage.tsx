import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ChevronRight, Clock, Stethoscope } from "lucide-react";
import SEO from "@/components/SEO";
import { getSymptomPageData, type SymptomPageData } from "@/lib/dataProvider";

const getUrgencyText = (name: string) => {
  const value = name.toLowerCase();
  if (value.includes("боль")) return "Обратитесь к врачу в ближайшее время, особенно если боль сильная, появилась внезапно или сопровождается снижением зрения, тошнотой, светобоязнью или покраснением.";
  if (value.includes("мушки")) return "Срочно обратитесь к офтальмологу, если мушек стало резко больше, появились вспышки света, тень или «занавеска» перед глазом.";
  if (value.includes("зрение")) return "Плановый осмотр нужен при стойкой нечёткости. Срочно обращайтесь, если зрение ухудшилось внезапно, только на одном глазу или вместе с болью.";
  return "Обратитесь к офтальмологу, если симптом сохраняется, усиливается, повторяется или сопровождается болью, покраснением либо снижением зрения.";
};

const SymptomPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState<SymptomPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      const result = await getSymptomPageData(slug);
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <div className="container py-10 text-center text-muted-foreground">Загрузка симптома...</div>;
  if (!data) return <div className="container py-10 text-center text-muted-foreground">Симптом не найден</div>;

  const { symptom, causes, relatedSymptoms } = data;
  const title = `${symptom.name} — причины, симптомы, лечение`;
  const description = `Почему возникает ${symptom.name.toLowerCase()}, какие заболевания могут быть причиной и когда нужно обратиться к врачу`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="container max-w-4xl py-8 sm:py-12 md:py-16">
      <SEO title={title} description={description} jsonLd={{ "@context": "https://schema.org", "@type": "MedicalWebPage", name: title, description, medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" } }} />
      <Link to="/symptoms" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
        <ArrowLeft className="h-4 w-4" /> Все симптомы
      </Link>

      <div className="mb-8 sm:mb-10">
        <span className="mb-3 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Stethoscope className="h-3.5 w-3.5" /> Симптом
        </span>
        <h1 className="mb-4">Симптом: {symptom.name}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{symptom.description || "Разберём возможные причины, признаки риска и следующий шаг к диагностике."}</p>
      </div>

      <section className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Что это может означать</h2>
        {causes.length > 0 ? (
          <div className="space-y-3">
            {causes.map((article, index) => (
              <Link key={article.id} to={`/${article.slug}/treatment`} className="group flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:bg-accent">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{article.title}</span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{article.excerpt}</span>
                </span>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Связанные заболевания уточняются. Для точной причины нужен очный осмотр.</p>
        )}
      </section>

      <section className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow">
        <div className="mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h2 className="mb-0 text-xl font-semibold text-foreground">Когда нужно обратиться к врачу</h2>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">{getUrgencyText(symptom.name)}</p>
      </section>

      {relatedSymptoms.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Связанные симптомы</h2>
          <div className="flex flex-wrap gap-2">
            {relatedSymptoms.map((item) => (
              <Link key={item.slug} to={`/symptoms/${item.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                <Clock className="h-3.5 w-3.5" /> {item.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default SymptomPage;