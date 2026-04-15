export interface MedicalSections {
  definition?: string;
  causes?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  prevention?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  subcategorySlug?: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  medicalSections?: MedicalSections;
  sections: {
    title: string;
    content: string;
    simpleContent?: string;
  }[];
  relatedIds: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  articleCount: number;
  icon: string;
  parentId?: string;
}

export const MEDICAL_SECTION_LABELS: Record<keyof MedicalSections, string> = {
  definition: "Что это",
  causes: "Причины",
  symptoms: "Симптомы",
  diagnosis: "Диагностика",
  treatment: "Лечение",
  prevention: "Профилактика",
};

// Helper functions for hierarchical categories
export const getRootCategories = () => categories.filter((c) => !c.parentId);
export const getChildCategories = (parentId: string) => categories.filter((c) => c.parentId === parentId);
export const getCategoryById = (id: string) => categories.find((c) => c.id === id);
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export const categories: Category[] = [
  // Root categories
  { id: "1", slug: "diseases", name: "Заболевания глаз", description: "Полная информация о заболеваниях органа зрения", articleCount: 42, icon: "👁️" },
  { id: "2", slug: "diagnostics", name: "Диагностика", description: "Методы обследования и диагностики", articleCount: 18, icon: "🔬" },
  { id: "3", slug: "treatment", name: "Лечение", description: "Современные методы лечения и хирургии", articleCount: 35, icon: "💊" },
  { id: "4", slug: "prevention", name: "Профилактика", description: "Рекомендации по сохранению зрения", articleCount: 15, icon: "🛡️" },
  { id: "5", slug: "research", name: "Научные публикации", description: "Исследования и клинические данные", articleCount: 27, icon: "📊" },
  { id: "6", slug: "legal", name: "Нормативные документы", description: "Законы и стандарты в офтальмологии", articleCount: 12, icon: "📜" },

  // Subcategories of "Заболевания глаз"
  { id: "101", slug: "glaucoma-cat", name: "Глаукома", description: "Виды глаукомы, диагностика и лечение", articleCount: 8, icon: "🔵", parentId: "1" },
  { id: "102", slug: "cataract-cat", name: "Катаракта", description: "Помутнение хрусталика и методы лечения", articleCount: 6, icon: "⚪", parentId: "1" },
  { id: "103", slug: "retina", name: "Заболевания сетчатки", description: "Дегенерации, отслойки и дистрофии сетчатки", articleCount: 10, icon: "🟠", parentId: "1" },
  { id: "104", slug: "cornea", name: "Заболевания роговицы", description: "Кератиты, дистрофии и травмы роговицы", articleCount: 7, icon: "🟢", parentId: "1" },
  { id: "105", slug: "refraction", name: "Аномалии рефракции", description: "Миопия, гиперметропия, астигматизм", articleCount: 11, icon: "🔴", parentId: "1" },

  // Subcategories of "Диагностика"
  { id: "201", slug: "imaging", name: "Визуализация", description: "ОКТ, ангиография, УЗИ глаза", articleCount: 9, icon: "📷", parentId: "2" },
  { id: "202", slug: "functional-tests", name: "Функциональные тесты", description: "Периметрия, тонометрия, рефрактометрия", articleCount: 6, icon: "📐", parentId: "2" },

  // Subcategories of "Лечение"
  { id: "301", slug: "surgery", name: "Хирургия", description: "Операции на глазах", articleCount: 15, icon: "🔪", parentId: "3" },
  { id: "302", slug: "laser", name: "Лазерное лечение", description: "LASIK, ФРК, лазерная коагуляция", articleCount: 10, icon: "⚡", parentId: "3" },
  { id: "303", slug: "pharmacology", name: "Фармакотерапия", description: "Глазные капли и инъекции", articleCount: 10, icon: "💉", parentId: "3" },
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "glaucoma",
    title: "Глаукома: полное руководство",
    excerpt: "Глаукома — группа заболеваний глаз, характеризующихся повышением внутриглазного давления и повреждением зрительного нерва.",
    category: "Заболевания глаз",
    categorySlug: "diseases",
    subcategorySlug: "glaucoma-cat",
    author: "Проф. Иванов А.В.",
    authorRole: "Доктор медицинских наук, офтальмолог",
    date: "2025-03-15",
    readTime: "12 мин",
    medicalSections: {
      definition: "Глаукома — хроническое прогрессирующее заболевание глаз, характеризующееся повышением внутриглазного давления (ВГД), развитием глаукомной оптической нейропатии и соответствующими изменениями поля зрения. Является одной из ведущих причин необратимой слепоты в мире.",
      causes: "Основные факторы риска: возраст старше 40 лет, наследственная предрасположенность, миопия высокой степени, сахарный диабет, артериальная гипертензия, длительное применение кортикостероидов. Патогенез связан с нарушением оттока внутриглазной жидкости через трабекулярную сеть.",
      symptoms: "Открытоугольная глаукома: бессимптомное начало, постепенное сужение полей зрения, снижение зрения на поздних стадиях. Закрытоугольная глаукома: острый приступ — резкая боль в глазу, головная боль, тошнота, затуманивание зрения, радужные круги вокруг источников света.",
      diagnosis: "Тонометрия (измерение ВГД), гониоскопия, периметрия, офтальмоскопия, ОКТ диска зрительного нерва, пахиметрия.",
      treatment: "Медикаментозное лечение: простагландины (латанопрост), бета-блокаторы (тимолол), ингибиторы карбоангидразы. Лазерное лечение: трабекулопластика, иридотомия. Хирургическое: трабекулэктомия, установка дренажных устройств, MIGS.",
      prevention: "Регулярные осмотры у офтальмолога после 40 лет, контроль ВГД, здоровый образ жизни, контроль сопутствующих заболеваний.",
    },
    sections: [
      { title: "Определение", content: "Глаукома — хроническое прогрессирующее заболевание глаз, характеризующееся повышением внутриглазного давления (ВГД), развитием глаукомной оптической нейропатии и соответствующими изменениями поля зрения.", simpleContent: "Глаукома — это болезнь глаз, при которой повышается давление внутри глаза." },
      { title: "Причины и факторы риска", content: "Основные факторы риска: возраст старше 40 лет, наследственная предрасположенность, миопия высокой степени, сахарный диабет.", simpleContent: "Риск глаукомы выше у людей старше 40 лет, если есть близкие родственники с этим заболеванием." },
      { title: "Симптомы", content: "Открытоугольная глаукома: бессимптомное начало, постепенное сужение полей зрения.", simpleContent: "Часто глаукома развивается незаметно — зрение сужается постепенно." },
      { title: "Лечение", content: "Медикаментозное лечение: простагландины, бета-блокаторы. Лазерное лечение: трабекулопластика. Хирургическое: трабекулэктомия, MIGS.", simpleContent: "Лечение включает глазные капли, лазерные процедуры и операции." },
    ],
    relatedIds: ["2", "3"],
  },
  {
    id: "2",
    slug: "cataract",
    title: "Катаракта: диагностика и лечение",
    excerpt: "Катаракта — помутнение хрусталика глаза, приводящее к снижению остроты зрения.",
    category: "Заболевания глаз",
    categorySlug: "diseases",
    subcategorySlug: "cataract-cat",
    author: "Д-р Петрова М.С.",
    authorRole: "Кандидат медицинских наук",
    date: "2025-02-20",
    readTime: "10 мин",
    medicalSections: {
      definition: "Катаракта — частичное или полное помутнение хрусталика глаза, приводящее к снижению остроты зрения. По данным ВОЗ, катаракта является причиной 51% случаев слепоты в мире.",
      treatment: "Единственный эффективный метод лечения — хирургический: факоэмульсификация катаракты с имплантацией интраокулярной линзы (ИОЛ).",
    },
    sections: [
      { title: "Определение", content: "Катаракта — частичное или полное помутнение хрусталика глаза.", simpleContent: "Катаракта — это когда линза внутри глаза мутнеет." },
      { title: "Лечение", content: "Факоэмульсификация катаракты с имплантацией ИОЛ.", simpleContent: "Мутный хрусталик заменяют на искусственную линзу." },
    ],
    relatedIds: ["1", "3"],
  },
  {
    id: "3",
    slug: "myopia",
    title: "Миопия (близорукость)",
    excerpt: "Миопия — нарушение рефракции, при котором изображение фокусируется перед сетчаткой.",
    category: "Заболевания глаз",
    categorySlug: "diseases",
    subcategorySlug: "refraction",
    author: "Проф. Иванов А.В.",
    authorRole: "Доктор медицинских наук, офтальмолог",
    date: "2025-01-10",
    readTime: "8 мин",
    medicalSections: {
      definition: "Миопия (близорукость) — аномалия рефракции, при которой параллельные лучи света фокусируются перед сетчаткой при расслабленной аккомодации.",
    },
    sections: [
      { title: "Определение", content: "Миопия — аномалия рефракции.", simpleContent: "Близорукость — когда далёкие предметы видны размыто." },
    ],
    relatedIds: ["1", "2"],
  },
  {
    id: "4",
    slug: "oct-diagnostics",
    title: "Оптическая когерентная томография (ОКТ)",
    excerpt: "ОКТ — неинвазивный метод визуализации структур глаза с высоким разрешением.",
    category: "Диагностика",
    categorySlug: "diagnostics",
    subcategorySlug: "imaging",
    author: "Д-р Сидоров К.Л.",
    authorRole: "Офтальмолог-диагност",
    date: "2025-03-01",
    readTime: "7 мин",
    sections: [
      { title: "Описание метода", content: "Оптическая когерентная томография позволяет получить поперечные срезы тканей глаза с разрешением до 5 микрон." },
    ],
    relatedIds: ["1"],
  },
];
