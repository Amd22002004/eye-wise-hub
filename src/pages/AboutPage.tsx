import { motion } from "framer-motion";
import { Shield, Eye, Users, BookOpen, Award, HeartPulse } from "lucide-react";
import SEO from "@/components/SEO";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const values = [
    {
      icon: Shield,
      title: "Доверие",
      desc: "Мы объединяем клиники с проверенной репутацией и подтверждённой экспертизой",
    },
    {
      icon: Eye,
      title: "Экспертность",
      desc: "Все материалы созданы и проверены практикующими офтальмологами",
    },
    {
      icon: Users,
      title: "Доступность",
      desc: "Информация для пациентов и специалистов — понятно и достоверно",
    },
    {
      icon: BookOpen,
      title: "Образование",
      desc: "Популяризация знаний о здоровье глаз и профилактике заболеваний",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <img
                  src="/logo.png"
                  alt="Ассоциация офтальмологических клиник"
                  className="h-16 w-16 object-contain"
                />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ассоциация офтальмологических клиник
            </h1>
            <p className="text-lg text-muted-foreground">
              Объединение профессионалов для развития офтальмологии и защиты зрения
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.div {...fadeIn}>
              <h2 className="mb-6 text-2xl font-semibold text-foreground">О нас</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                Ассоциация офтальмологических клиник — это профессиональное сообщество, 
                объединяющее ведущие медицинские учреждения, специализирующиеся на диагностике 
                и лечении заболеваний глаз. Мы созданы для повышения качества офтальмологической 
                помощи и популяризации знаний о здоровье зрения.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Наша платформа «ОфтальмоВики» служит мостом между врачами и пациентами: 
                здесь собраны проверенные медицинские материалы, доступные как для 
                профессионалов, так и для широкой аудитории.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-t border-border bg-accent/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.div {...fadeIn}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <HeartPulse className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Наша миссия</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Сделать качественную офтальмологическую помощь доступной для каждого. 
                Мы стремимся к тому, чтобы каждый человек мог получить достоверную 
                информацию о здоровье глаз и найти квалифицированного специалиста.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role in Ophthalmology */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.div {...fadeIn}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Роль в офтальмологии</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Стандартизация знаний.</strong> Мы формируем 
                  единые подходы к диагностике и лечению, основанные на доказательной медицине 
                  и международных клинических рекомендациях.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Профессиональное развитие.</strong> Ассоциация 
                  проводит конференции, мастер-классы и образовательные программы для врачей-офтальмологов.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Пациентская просвещённость.</strong> Мы помогаем 
                  людям разбираться в заболеваниях глаз, методах лечения и профилактики, 
                  предотвращая необоснованные страхи и ошибочные решения.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values / Trust Section */}
      <section className="border-t border-border bg-accent/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <motion.div {...fadeIn} className="mb-12 text-center">
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Почему нам доверяют</h2>
              <p className="text-muted-foreground">
                Принципы, на которых строится наша работа
              </p>
            </motion.div>

            <motion.div
              className="grid gap-6 sm:grid-cols-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {values.map((value, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="mb-3 text-xl font-semibold text-foreground">
              Забота о вашем зрении — наша приоритет
            </h3>
            <p className="mb-6 text-muted-foreground">
              Изучайте материалы, находите ответы на вопросы и обращайтесь 
              к проверенным специалистам
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;