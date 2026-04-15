import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/mockData";

const CategoryGrid = () => (
  <section className="container pb-20">
    <h2 className="mb-8 text-center">Разделы энциклопедии</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
        >
          <Link
            to={`/categories/${cat.slug}`}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-6 transition-all duration-200 card-shadow hover:card-shadow-hover"
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {cat.name}
            </span>
            <span className="text-sm text-muted-foreground">{cat.description}</span>
            <span className="mt-auto text-xs font-medium text-secondary">{cat.articleCount} статей</span>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
