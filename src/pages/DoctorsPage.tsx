import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, BookOpen, Award, GraduationCap } from "lucide-react";
import { doctors } from "@/data/doctorsData";
import SEO from "@/components/SEO";

const DoctorsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = doctors.find((d) => d.id === selectedId);

  return (
    <div className="container max-w-5xl py-8 sm:py-12 md:py-16">
      <SEO
        title="Врачи-офтальмологи"
        description="Ведущие врачи-офтальмологи: образование, специализация, научные интересы и публикации. Ассоциация офтальмологических клиник."
      />
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2">Врачи-офтальмологи</h1>
        <p className="text-lg text-muted-foreground">
          Ведущие специалисты Ассоциации офтальмологических клиник
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <button
              onClick={() => setSelectedId(selectedId === doc.id ? null : doc.id)}
              className={`w-full text-left rounded-2xl border bg-card p-5 sm:p-6 transition-all duration-200 card-shadow hover:card-shadow-hover ${
                selectedId === doc.id ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <User className="h-6 w-6 text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-foreground leading-snug">{doc.name}</h3>
                  <p className="mt-1 text-base text-muted-foreground">{doc.specialization}</p>
                  <p className="mt-1 text-sm text-muted-foreground/70">{doc.experience}</p>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Selected doctor details */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8 card-shadow"
        >
          <h2 className="mb-6">{selected.name}</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Education */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold">Образование</h3>
              </div>
              <ul className="space-y-1.5">
                {selected.education.map((e, i) => (
                  <li key={i} className="text-base text-muted-foreground">• {e}</li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold">Достижения</h3>
              </div>
              <ul className="space-y-1.5">
                {selected.achievements.map((a, i) => (
                  <li key={i} className="text-base text-muted-foreground">• {a}</li>
                ))}
              </ul>
            </div>

            {/* Scientific interests */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold">Научные интересы</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.scientificInterests.map((s) => (
                  <span key={s} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Publications */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold">Публикации</h3>
              </div>
              <ul className="space-y-1.5">
                {selected.publications.map((p, i) => (
                  <li key={i} className="text-base text-muted-foreground">• {p}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorsPage;
