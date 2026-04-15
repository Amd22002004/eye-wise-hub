import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, GraduationCap, BookOpen, FileText } from "lucide-react";
import {
  dissertations,
  DISSERTATION_TYPE_LABELS,
  INSTITUTIONS,
  DISSERTATION_TOPICS,
  type DissertationType,
} from "@/data/dissertationsData";
import SEO from "@/components/SEO";

const ALL = "__all__";

const DissertationsPage = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(ALL);
  const [topic, setTopic] = useState(ALL);
  const [institution, setInstitution] = useState(ALL);

  const years = useMemo(() => [...new Set(dissertations.map((d) => d.year))].sort((a, b) => b - a), []);
  const [year, setYear] = useState(ALL);

  const filtered = useMemo(() => {
    return dissertations.filter((d) => {
      if (type !== ALL && d.type !== type) return false;
      if (topic !== ALL && d.topic !== topic) return false;
      if (institution !== ALL && d.institution !== institution) return false;
      if (year !== ALL && d.year !== Number(year)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.title.toLowerCase().includes(q) &&
          !d.author.toLowerCase().includes(q) &&
          !d.abstract.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [type, topic, institution, year, search]);

  const selectClass =
    "h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow";

  return (
    <div className="container max-w-5xl py-8 sm:py-12 md:py-16">
      <SEO
        title="Диссертации по офтальмологии"
        description="Кандидатские и докторские диссертации по офтальмологии. Тематическая классификация, фильтрация по учреждениям и годам."
      />
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2">Диссертации</h1>
        <p className="text-lg text-muted-foreground">
          Кандидатские и докторские диссертации по офтальмологии
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию, автору или описанию…"
          className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-base text-foreground card-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />

        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          <option value={ALL}>Все типы</option>
          {(Object.keys(DISSERTATION_TYPE_LABELS) as DissertationType[]).map((t) => (
            <option key={t} value={t}>{DISSERTATION_TYPE_LABELS[t]}</option>
          ))}
        </select>

        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass}>
          <option value={ALL}>Все темы</option>
          {DISSERTATION_TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
          <option value={ALL}>Все годы</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={institution} onChange={(e) => setInstitution(e.target.value)} className={selectClass}>
          <option value={ALL}>Все учреждения</option>
          {INSTITUTIONS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>

        {(type !== ALL || topic !== ALL || year !== ALL || institution !== ALL || search) && (
          <button
            onClick={() => { setType(ALL); setTopic(ALL); setYear(ALL); setInstitution(ALL); setSearch(""); }}
            className="text-sm text-secondary hover:underline"
          >
            Сбросить
          </button>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Найдено: {filtered.length} {filtered.length === 1 ? "диссертация" : filtered.length < 5 ? "диссертации" : "диссертаций"}
      </p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center card-shadow">
            <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">Ничего не найдено. Попробуйте изменить фильтры.</p>
          </div>
        ) : (
          filtered.map((dis, i) => (
            <motion.article
              key={dis.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  {dis.type === "doctoral" ? (
                    <BookOpen className="h-5 w-5 text-secondary" />
                  ) : (
                    <GraduationCap className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                      {DISSERTATION_TYPE_LABELS[dis.type]}
                    </span>
                    <span className="rounded-lg bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                      {dis.topic}
                    </span>
                    <span className="text-sm text-muted-foreground">{dis.year}</span>
                  </div>
                  <h3 className="mb-1.5 text-base sm:text-lg font-semibold text-foreground leading-snug">
                    {dis.title}
                  </h3>
                  <p className="mb-3 text-base leading-relaxed text-muted-foreground line-clamp-2">
                    {dis.abstract}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/70">{dis.author}</span>
                    <span className="text-muted-foreground/60">{dis.institution}</span>
                    {dis.supervisor && (
                      <span>Науч. рук.: {dis.supervisor}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
};

export default DissertationsPage;
