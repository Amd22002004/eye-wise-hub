import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Eye, FileText } from "lucide-react";
import { articles, categories } from "@/data/mockData";

type Tab = "articles" | "new";

const CMSPage = () => {
  const [tab, setTab] = useState<Tab>("articles");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(categories[0]?.slug ?? "");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Статья «${title}» сохранена как ${status === "draft" ? "черновик" : "опубликованная"}`);
    setTitle("");
    setExcerpt("");
    setTab("articles");
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-8">Панель управления</h1>

      <div className="mb-8 flex gap-2">
        {[
          { key: "articles" as Tab, label: "Статьи", icon: FileText },
          { key: "new" as Tab, label: "Новая статья", icon: Plus },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              tab === key ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "articles" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 card-shadow"
            >
              <div>
                <p className="font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.category} · {a.author} · {a.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {tab === "new" && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-border bg-card p-8 card-shadow"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Заголовок</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground transition-shadow duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Название статьи"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Краткое описание</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-shadow duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Описание статьи…"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="draft">Черновик</option>
                <option value="published">Опубликовать</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Сохранить статью
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default CMSPage;
