import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Briefcase, ChevronRight } from "lucide-react";
import { doctors } from "@/data/doctorsData";
import SEO from "@/components/SEO";

const DoctorsPage = () => {
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
            <Link
              to={`/doctors/${doc.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 card-shadow hover:card-shadow-hover hover:border-primary/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                <User className="h-6 w-6 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
                  {doc.name}
                </h3>
                <p className="mt-1 text-sm text-secondary flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> {doc.specialization}
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">{doc.experience}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doc.scientificInterests.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors self-center" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
