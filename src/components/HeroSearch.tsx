import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { articles } from "@/data/mockData";

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return articles
      .filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  const handleSelect = (slug: string) => {
    setQuery("");
    navigate(`/article/${slug}`);
  };

  return (
    <section className="relative flex flex-col items-center px-5 py-20 sm:py-24 md:py-32">
      <motion.img
        src="/logo.png"
        alt="ОфтальмоВики"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 h-20 w-20 sm:h-24 sm:w-24 object-contain"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4 sm:mb-5 text-center text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] leading-[1.15]"
      >
        Энциклопедия офтальмологии
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="mb-10 sm:mb-12 max-w-xl text-center text-muted-foreground text-lg sm:text-xl md:text-2xl"
      >
        Достоверная медицинская информация для пациентов, студентов и врачей
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        <div className="relative">
          <Search className="absolute left-4 sm:left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск заболеваний, методов лечения…"
            className="h-12 sm:h-14 w-full rounded-2xl border border-border bg-card pl-12 sm:pl-14 pr-5 text-base shadow-sm transition-shadow duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:card-shadow-hover"
          />
        </div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card card-shadow"
            >
              {results.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleSelect(article.slug)}
                  className="flex w-full flex-col gap-0.5 px-4 sm:px-5 py-3 text-left transition-colors duration-150 hover:bg-accent"
                >
                  <span className="text-sm font-semibold text-foreground">{article.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default HeroSearch;