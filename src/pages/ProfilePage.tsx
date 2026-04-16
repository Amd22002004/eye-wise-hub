import { motion } from "framer-motion";
import { User, Mail, Shield, Clock, FileText, BookOpen } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="mb-8">Личный кабинет</h1>

      {/* User info card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-8 card-shadow mb-8"
      >
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Гость</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5" /> Войдите для доступа ко всем функциям
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { icon: FileText, label: "Мои статьи", value: "0" },
          { icon: BookOpen, label: "Закладки", value: "0" },
          { icon: Clock, label: "История", value: "0" },
        ].map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 card-shadow text-center"
          >
            <Icon className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-8 card-shadow space-y-6"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Настройки</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Имя</label>
            <input
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="email@example.com"
            />
          </div>
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]">
            Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
