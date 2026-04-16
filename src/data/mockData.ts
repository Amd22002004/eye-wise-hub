export interface DualContent {
  simple: string;
  professional: string;
}

export interface MedicalSections {
  definition?: DualContent;
  causes?: DualContent;
  symptoms?: DualContent;
  diagnosis?: DualContent;
  treatment?: DualContent;
  prevention?: DualContent;
}

export type MedicalSectionKey = keyof MedicalSections;

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

export const MEDICAL_SECTION_LABELS: Record<MedicalSectionKey, string> = {
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
  { id: "0", slug: "general-info", name: "Основы зрения", description: "Основы офтальмологии, анатомия глаза, зрительный анализатор", articleCount: 4, icon: "📖" },
  { id: "1", slug: "diseases", name: "Заболевания глаз", description: "Полная информация о заболеваниях органа зрения", articleCount: 42, icon: "👁️" },
  { id: "2", slug: "diagnostics", name: "Диагностика", description: "Методы обследования и диагностики", articleCount: 18, icon: "🔬" },
  { id: "3", slug: "treatment", name: "Лечение", description: "Современные методы лечения и хирургии", articleCount: 35, icon: "💊" },
  { id: "4", slug: "prevention", name: "Профилактика", description: "Рекомендации по сохранению зрения", articleCount: 15, icon: "🛡️" },
  { id: "10", slug: "symptoms", name: "Симптомы и жалобы", description: "Описание симптомов и их связь с заболеваниями глаз", articleCount: 5, icon: "🩺" },
  { id: "5", slug: "research", name: "Научные публикации", description: "Исследования и клинические данные", articleCount: 27, icon: "📊" },
  { id: "6", slug: "legal", name: "Нормативные документы", description: "Законы и стандарты в офтальмологии", articleCount: 12, icon: "📜" },
  { id: "7", slug: "dissertations", name: "Диссертации", description: "Кандидатские и докторские диссертации", articleCount: 7, icon: "🎓" },
  { id: "8", slug: "doctors", name: "Врачи-офтальмологи", description: "Ведущие специалисты и их профили", articleCount: 4, icon: "👨‍⚕️" },
  { id: "9", slug: "modern-directions", name: "Современные направления", description: "ИИ, генетика, телемедицина и новые технологии", articleCount: 4, icon: "🚀" },
  // Подкатегории "Основы зрения"
  { id: "001", slug: "what-is-ophthalmology", name: "Что такое офтальмология", description: "Введение в науку о зрении", articleCount: 1, icon: "📘", parentId: "0" },
  { id: "002", slug: "eye-anatomy", name: "Анатомия и физиология глаза", description: "Строение и функции органа зрения", articleCount: 1, icon: "🧬", parentId: "0" },
  { id: "003", slug: "visual-analyzer", name: "Зрительный анализатор", description: "От сетчатки до зрительной коры", articleCount: 1, icon: "🧠", parentId: "0" },
  { id: "004", slug: "age-vision", name: "Возрастные особенности зрения", description: "Зрение от рождения до старости", articleCount: 1, icon: "👶", parentId: "0" },
  // Подкатегории "Заболевания глаз"
  { id: "101", slug: "glaucoma-cat", name: "Глаукома", description: "Виды глаукомы, диагностика и лечение", articleCount: 8, icon: "🔵", parentId: "1" },
  { id: "102", slug: "cataract-cat", name: "Катаракта", description: "Помутнение хрусталика и методы лечения", articleCount: 6, icon: "⚪", parentId: "1" },
  { id: "103", slug: "retina", name: "Заболевания сетчатки", description: "Дегенерации, отслойки и дистрофии сетчатки", articleCount: 10, icon: "🟠", parentId: "1" },
  { id: "104", slug: "cornea", name: "Заболевания роговицы", description: "Кератиты, дистрофии и травмы роговицы", articleCount: 7, icon: "🟢", parentId: "1" },
  { id: "105", slug: "refraction", name: "Аномалии рефракции", description: "Миопия, гиперметропия, астигматизм", articleCount: 11, icon: "🔴", parentId: "1" },
  // Подкатегории "Диагностика"
  { id: "201", slug: "imaging", name: "Визуализация", description: "ОКТ, ангиография, УЗИ глаза", articleCount: 9, icon: "📷", parentId: "2" },
  { id: "202", slug: "functional-tests", name: "Функциональные тесты", description: "Периметрия, тонометрия, рефрактометрия", articleCount: 6, icon: "📐", parentId: "2" },
  // Подкатегории "Лечение"
  { id: "301", slug: "surgery", name: "Хирургия", description: "Операции на глазах", articleCount: 15, icon: "🔪", parentId: "3" },
  { id: "302", slug: "laser", name: "Лазерное лечение", description: "LASIK, ФРК, лазерная коагуляция", articleCount: 10, icon: "⚡", parentId: "3" },
  { id: "303", slug: "pharmacology", name: "Фармакотерапия", description: "Глазные капли и инъекции", articleCount: 10, icon: "💉", parentId: "3" },
  // Подкатегории "Симптомы и жалобы"
  { id: "1001", slug: "eye-pain", name: "Боль в глазах", description: "Причины и виды боли в глазах", articleCount: 1, icon: "😣", parentId: "10" },
  { id: "1002", slug: "eye-redness", name: "Покраснение глаз", description: "Причины покраснения и конъюнктивита", articleCount: 1, icon: "🔴", parentId: "10" },
  { id: "1003", slug: "blurred-vision", name: "Размытое зрение", description: "Причины нечёткого зрения", articleCount: 1, icon: "🌫️", parentId: "10" },
  { id: "1004", slug: "floaters", name: "Мушки перед глазами", description: "Плавающие помутнения в поле зрения", articleCount: 1, icon: "✨", parentId: "10" },
  { id: "1005", slug: "vision-loss", name: "Снижение зрения", description: "Причины ухудшения зрительных функций", articleCount: 1, icon: "📉", parentId: "10" },
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
      definition: {
        simple: "Глаукома — это болезнь глаз, при которой повышается давление внутри глаза. Из-за этого повреждается зрительный нерв, и человек может постепенно терять зрение. Это одна из главных причин слепоты.",
        professional: "Глаукома — хроническое прогрессирующее заболевание глаз, характеризующееся повышением внутриглазного давления (ВГД), развитием глаукомной оптической нейропатии и соответствующими изменениями поля зрения. Является одной из ведущих причин необратимой слепоты в мире.",
      },
      causes: {
        simple: "Риск глаукомы выше у людей старше 40 лет, особенно если есть близкие родственники с этим заболеванием, сильная близорукость или сахарный диабет.",
        professional: "Основные факторы риска: возраст старше 40 лет, наследственная предрасположенность, миопия высокой степени, сахарный диабет, артериальная гипертензия, длительное применение кортикостероидов. Патогенез связан с нарушением оттока внутриглазной жидкости через трабекулярную сеть.",
      },
      symptoms: {
        simple: "Часто глаукома развивается незаметно — зрение сужается постепенно. Иногда бывают острые приступы с сильной болью в глазу и головной болью.",
        professional: "Открытоугольная глаукома: бессимптомное начало, постепенное сужение полей зрения, снижение зрения на поздних стадиях. Закрытоугольная глаукома: острый приступ — резкая боль в глазу, головная боль, тошнота, затуманивание зрения, радужные круги вокруг источников света.",
      },
      diagnosis: {
        simple: "Врач измеряет давление в глазу, проверяет поле зрения и осматривает глазной нерв с помощью специальных приборов.",
        professional: "Тонометрия (измерение ВГД), гониоскопия, периметрия, офтальмоскопия, ОКТ диска зрительного нерва, пахиметрия. Дифференциальная диагностика с офтальмогипертензией и вторичными глаукомами.",
      },
      treatment: {
        simple: "Лечение включает глазные капли, снижающие давление, лазерные процедуры и операции. Чем раньше начать лечение, тем лучше прогноз.",
        professional: "Медикаментозное лечение: простагландины (латанопрост), бета-блокаторы (тимолол), ингибиторы карбоангидразы. Лазерное лечение: трабекулопластика, иридотомия. Хирургическое: трабекулэктомия, установка дренажных устройств, MIGS.",
      },
      prevention: {
        simple: "Регулярно посещайте офтальмолога после 40 лет, контролируйте давление и ведите здоровый образ жизни.",
        professional: "Регулярные осмотры у офтальмолога после 40 лет с измерением ВГД, периметрией и оценкой ДЗН. Контроль системных факторов риска: артериальной гипертензии, сахарного диабета. Модификация образа жизни.",
      },
    },
    sections: [],
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
      definition: {
        simple: "Катаракта — это когда линза внутри глаза (хрусталик) мутнеет, и зрение ухудшается. Это самая частая причина обратимой слепоты в мире.",
        professional: "Катаракта — частичное или полное помутнение хрусталика глаза, приводящее к снижению остроты зрения. По данным ВОЗ, катаракта является причиной 51% случаев слепоты в мире. Классификация по локализации: ядерная, кортикальная, заднекапсулярная.",
      },
      symptoms: {
        simple: "Зрение становится мутным, как будто смотрите через грязное стекло. Цвета кажутся тусклыми, появляется чувствительность к яркому свету.",
        professional: "Постепенное снижение остроты зрения, монокулярная диплопия, изменение цветовосприятия, повышенная чувствительность к бликам. Миопический сдвиг рефракции при ядерном склерозе.",
      },
      treatment: {
        simple: "Катаракту лечат операцией — мутный хрусталик заменяют на искусственную прозрачную линзу. Операция безопасная и занимает 15–20 минут.",
        professional: "Единственный эффективный метод лечения — хирургический: факоэмульсификация катаракты с имплантацией интраокулярной линзы (ИОЛ). Выбор ИОЛ: монофокальные, мультифокальные, торические. Фемтолазерная ассистированная хирургия катаракты (FLACS).",
      },
    },
    sections: [],
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
      definition: {
        simple: "Близорукость — когда далёкие предметы видны размыто, а близкие — чётко. Это очень распространённая проблема со зрением.",
        professional: "Миопия (близорукость) — аномалия рефракции, при которой параллельные лучи света фокусируются перед сетчаткой при расслабленной аккомодации. Классификация: слабая (до −3.0 D), средняя (−3.25 – −6.0 D), высокая (более −6.0 D).",
      },
      causes: {
        simple: "Близорукость часто передаётся по наследству. Также влияют длительная работа вблизи и недостаток времени на свежем воздухе.",
        professional: "Мультифакториальная этиология: генетическая предрасположенность (полигенное наследование), избыточная аккомодативная нагрузка, дефицит наружного освещения. Патогенез связан с удлинением переднезадней оси глаза.",
      },
      treatment: {
        simple: "Носить очки или контактные линзы. Можно сделать лазерную коррекцию зрения (LASIK), чтобы не зависеть от очков.",
        professional: "Оптическая коррекция: очки, МКЛ, ортокератология. Хирургическая коррекция: LASIK, ФРК, SMILE, имплантация факичных ИОЛ при высокой миопии. Медикаментозный контроль прогрессирования: атропин 0.01–0.05%.",
      },
    },
    sections: [],
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
    medicalSections: {
      definition: {
        simple: "ОКТ — это безболезненное обследование, которое делает детальные «фотографии» внутренних структур глаза. Помогает врачу увидеть проблемы на ранней стадии.",
        professional: "Оптическая когерентная томография — неинвазивный метод визуализации, основанный на низкокогерентной интерферометрии. Обеспечивает получение поперечных срезов тканей глаза с аксиальным разрешением до 5 мкм (спектральная ОКТ) и 1–2 мкм (swept-source ОКТ).",
      },
    },
    sections: [],
    relatedIds: ["1"],
  },
];
