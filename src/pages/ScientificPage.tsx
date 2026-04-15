import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, GraduationCap, FlaskConical, FileText } from "lucide-react";
import { scientificWorks, PUBLICATION_TYPE_LABELS, type PublicationType } from "@/data/scientificData";

const ALL = "__all__";

const typeIcons: Record<PublicationType, typeof BookOpen> = {
  publication: BookOpen,
  dissertation: GraduationCap,
  clinical_study: FlaskConical,
};

const ScientificPage = () => {
  const [topic, setTopic] = useState(ALL);
  const [author, setAuthor] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [search, setSearch] = useState("");

  const topics = useMemo(() => [...new Set(scientificWorks.map((w) => w.topic))].sort(), []);
  const authors = useMemo(() => [...new Set(scientificWorks.flatMap((w) => w.authors))].sort(), []);
  const years = useMemo(() => [...new Set(scientificWorks.map((w) => w.year))].sort((a, b) => b - a), []);

  const filtered = useMemo(() => {
    return scientificWorks.filter((w) => {
      if (topic !== ALL && w.topic !== topic) return false;
      if (author !== ALL && !w.authors.includes(author)) return false;
      if (year !== ALL && w.year !== Number(year)) return false;
      if (type !== ALL && w.type !== type) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !w.title.toLowerCase().includes(q) &&
          !w.abstract.toLowerCase().includes(q) &&
          !w.authors.some((a) => a.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [topic, author, year, type, search]);

  const selectClass =
    "h-9 sm:h-10 rounded-xl border border-border bg-background px-2.5 sm:px-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow duration-200";

  return (
    <div className="container max-w-5xl py-8 sm:py-12 md:py-16">
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2">Научные публикации</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Исследования, диссертации и клинические данные в области офтальмологии</p>
      </div>

      {/* Search */}
      <div className="relative mb-5 sm:mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию, автору или описанию…"
          className="h-11 sm:h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm text-foreground card-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow duration-200"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />

        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass}>
          <option value={ALL}>Все темы</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={author} onChange={(e) => setAuthor(e.target.value)} className={selectClass}>
          <option value={ALL}>Все авторы</option>
          {authors.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
          <option value={ALL}>Все годы</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          <option value={ALL}>Все типы</option>
          {(Object.keys(PUBLICATION_TYPE_LABELS) as PublicationType[]).map((t) => (
            <option key={t} value={t}>{PUBLICATION_TYPE_LABELS[t]}</option>
          ))}
        </select>

        {(topic !== ALL || author !== ALL || year !== ALL || type !== ALL || search) && (
          <button
            onClick={() => { setTopic(ALL); setAuthor(ALL); setYear(ALL); setType(ALL); setSearch(""); }}
            className="text-xs text-secondary hover:underline transition-colors"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs sm:text-sm text-muted-foreground">
        Найдено: {filtered.length} {filtered.length === 1 ? "работа" : filtered.length < 5 ? "работы" : "работ"}
      </p>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 text-center card-shadow">
            <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground">Ничего не найдено. Попробуйте изменить фильтры.</p>
          </div>
        ) : (
          filtered.map((work, i) => {
            const Icon = typeIcons[work.type];
            return (
              <motion.article
                key={work.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 card-shadow"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                    <Icon className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="rounded-lg bg-accent px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-accent-foreground">
                        {PUBLICATION_TYPE_LABELS[work.type]}
                      </span>
                      <span className="rounded-lg bg-accent px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-accent-foreground">
                        {work.topic}
                      </span>
                      <span className="text-[11px] sm:text-xs text-muted-foreground">{work.year}</span>
                    </div>
                    <h3 className="mb-1.5 text-sm sm:text-base font-semibold text-foreground leading-snug">{work.title}</h3>
                    <p className="mb-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">{work.abstract}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">{work.authors.join(", ")}</span>
                      {work.journal && (
                        <>
                          <span>·</span>
                          <span className="italic">{work.journal}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ScientificPage;