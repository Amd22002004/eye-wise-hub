import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Eye, FileText, Stethoscope, FolderTree } from "lucide-react";
import { MEDICAL_SECTION_LABELS, type MedicalSectionKey, type DualContent, getRootCategories, getChildCategories } from "@/data/supabaseContent";
import { useContent } from "@/hooks/useContent";

type Tab = "articles" | "new" | "categories";

type DualFields = Record<MedicalSectionKey, DualContent>;

const EMPTY_DUAL: DualFields = {
  definition: { simple: "", professional: "" },
  causes: { simple: "", professional: "" },
  symptoms: { simple: "", professional: "" },
  diagnosis: { simple: "", professional: "" },
  treatment: { simple: "", professional: "" },
  prevention: { simple: "", professional: "" },
};

const CMSPage = () => {
  const { data } = useContent(true);
  const articles = data?.articles ?? [];
  const categories = data?.categories ?? [];
  const [tab, setTab] = useState<Tab>("articles");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [medical, setMedical] = useState<DualFields>({ ...EMPTY_DUAL });

  // Category management state
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatParent, setNewCatParent] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📁");

  const roots = getRootCategories(categories);
  const selectedRoot = categories.find((c) => c.slug === mainCategory);
  const subcategories = selectedRoot ? getChildCategories(categories, selectedRoot.id) : [];

  const updateMedical = (key: MedicalSectionKey, layer: "simple" | "professional", value: string) => {
    setMedical((prev) => ({ ...prev, [key]: { ...prev[key], [layer]: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Статья «${title}» сохранена как ${status === "draft" ? "черновик" : "опубликованная"}`);
    setTitle("");
    setExcerpt("");
    setMedical({ ...EMPTY_DUAL });
    setTab("articles");
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parentLabel = newCatParent ? categories.find(c => c.id === newCatParent)?.name : "корневая";
    alert(`Категория «${newCatName}» создана (родитель: ${parentLabel})`);
    setNewCatName("");
    setNewCatDesc("");
    setNewCatParent("");
    setNewCatIcon("📁");
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-8">Панель управления</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        {([
          { key: "articles" as Tab, label: "Статьи", icon: FileText },
          { key: "new" as Tab, label: "Новая статья", icon: Plus },
          { key: "categories" as Tab, label: "Категории", icon: FolderTree },
        ]).map(({ key, label, icon: Icon }) => (
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

      {/* Articles list */}
      {tab === "articles" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 card-shadow"
            >
              <div>
                <p className="font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.category}
                  {a.subcategorySlug && ` → ${categories.find(c => c.slug === a.subcategorySlug)?.name ?? a.subcategorySlug}`}
                  {" · "}{a.author} · {a.date}
                </p>
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

      {/* New article form */}
      {tab === "new" && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic info */}
          <div className="rounded-2xl border border-border bg-card p-8 card-shadow space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Основная информация</h2>
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

            {/* Category selectors */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Основная категория</label>
                <select
                  value={mainCategory}
                  onChange={(e) => { setMainCategory(e.target.value); setSubcategory(""); }}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {roots.map((c) => (
                    <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Подкатегория</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  disabled={subcategories.length === 0}
                >
                  <option value="">— Без подкатегории —</option>
                  {subcategories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
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

          {/* Medical content */}
          <div className="rounded-2xl border border-border bg-card p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
                <Stethoscope className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Медицинское содержание</h2>
                <p className="text-xs text-muted-foreground">Структурированные разделы статьи</p>
              </div>
            </div>

            {(Object.keys(MEDICAL_SECTION_LABELS) as MedicalSectionKey[]).map((key) => (
              <div key={key} className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  {MEDICAL_SECTION_LABELS[key]}
                </p>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Для пациентов (простое объяснение)</label>
                  <textarea
                    value={medical[key].simple}
                    onChange={(e) => updateMedical(key, "simple", e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground leading-relaxed transition-shadow duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder={`Простое объяснение раздела «${MEDICAL_SECTION_LABELS[key]}»…`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Для специалистов (профессиональное)</label>
                  <textarea
                    value={medical[key].professional}
                    onChange={(e) => updateMedical(key, "professional", e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground leading-relaxed transition-shadow duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder={`Профессиональное описание раздела «${MEDICAL_SECTION_LABELS[key]}»…`}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Сохранить статью
          </button>
        </motion.form>
      )}

      {/* Categories management */}
      {tab === "categories" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Category tree */}
          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <h2 className="text-lg font-semibold text-foreground mb-4">Структура категорий</h2>
            <div className="space-y-3">
              {roots.map((root) => {
                const children = getChildCategories(root.id);
                return (
                  <div key={root.id}>
                    <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-3">
                      <span className="text-lg">{root.icon}</span>
                      <span className="font-medium text-foreground">{root.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{root.articleCount} статей</span>
                    </div>
                    {children.length > 0 && (
                      <div className="ml-8 mt-1.5 space-y-1.5">
                        {children.map((child) => (
                          <div key={child.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-2.5 pl-4">
                            <span className="text-sm">{child.icon}</span>
                            <span className="text-sm text-foreground">{child.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{child.articleCount}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add category form */}
          <form onSubmit={handleCategorySubmit} className="rounded-2xl border border-border bg-card p-8 card-shadow space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Добавить категорию</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Название</label>
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="Название категории"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Иконка</label>
                <input
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="📁"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Описание</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Краткое описание категории…"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Родительская категория</label>
              <select
                value={newCatParent}
                onChange={(e) => setNewCatParent(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">— Корневая категория —</option>
                {roots.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Создать категорию
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default CMSPage;
