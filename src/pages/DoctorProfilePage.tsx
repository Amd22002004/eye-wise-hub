import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, GraduationCap, Award, BookOpen, Briefcase, FileText } from "lucide-react";
import { doctors } from "@/data/doctorsData";
import { articles } from "@/data/mockData";
import SEO from "@/components/SEO";

const DoctorProfilePage = () => {
  const { slug } = useParams();
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
    return (
      <div className="container py-20 text-center">
        <h1>Врач не найден</h1>
        <Link to="/doctors" className="mt-4 inline-block text-secondary hover:underline">← К списку врачей</Link>
      </div>
    );
  }

  // Find articles by this doctor (matching by name)
  const doctorArticles = articles.filter(
    (a) => a.author.includes(doctor.name.split(" ")[0]) || doctor.name.includes(a.author.replace(/^(Проф\.|Д-р)\s*/, "").split(" ")[0])
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container max-w-3xl py-8 sm:py-12 md:py-16"
    >
      <SEO
        title={`${doctor.name} — офтальмолог`}
        description={`${doctor.specialization}. ${doctor.experience}.`}
      />
      <Link to="/doctors" className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
        <ArrowLeft className="h-4 w-4" /> Все врачи
      </Link>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 sm:p-8 card-shadow mb-8"
      >
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{doctor.name}</h1>
            <p className="text-base text-secondary font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> {doctor.specialization}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{doctor.experience}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-6 card-shadow"
        >
          <div className="mb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">Образование</h2>
          </div>
          <ul className="space-y-2">
            {doctor.education.map((e, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {e}</li>
            ))}
          </ul>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 card-shadow"
        >
          <div className="mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">Достижения</h2>
          </div>
          <ul className="space-y-2">
            {doctor.achievements.map((a, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {a}</li>
            ))}
          </ul>
        </motion.div>

        {/* Scientific interests */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 card-shadow"
        >
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">Научные интересы</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.scientificInterests.map((s) => (
              <span key={s} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 card-shadow"
        >
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">Публикации</h2>
          </div>
          <ul className="space-y-2">
            {doctor.publications.map((p, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {p}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Doctor's articles on the site */}
      {doctorArticles.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">Статьи на сайте</h2>
          </div>
          <div className="space-y-3">
            {doctorArticles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="block rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:card-shadow-hover hover:border-primary/30"
              >
                <p className="text-sm font-medium text-foreground">{article.title}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default DoctorProfilePage;
