import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/general-info", label: "Основы зрения" },
  { to: "/categories", label: "Разделы" },
  { to: "/symptoms", label: "Симптомы" },
  { to: "/articles", label: "Статьи" },
  { to: "/doctors", label: "Врачи" },
  { to: "/scientific", label: "Публикации" },
  { to: "/modern-directions", label: "Направления" },
  { to: "/cms", label: "Админка" },
  { to: "/profile", label: "Кабинет" },
];

const BRAND_NAME = "Ассоциация офтальмологических клиник";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.png"
            alt={BRAND_NAME}
            className="h-10 w-10 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <span className="max-w-[190px] text-sm font-bold leading-tight text-foreground sm:max-w-[260px] sm:text-base lg:max-w-[220px] xl:max-w-[300px]">
            {BRAND_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-0 lg:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-2.5 py-1.5 text-[13px] xl:text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground whitespace-nowrap"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className={`relative z-10 ${active ? "text-accent-foreground" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border bg-card px-4 pb-4 lg:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
};

export default Navbar;
