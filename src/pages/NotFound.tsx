import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SEO title="Страница не найдена" description="Запрашиваемая страница не найдена." />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Страница не найдена</p>
        <a href="/" className="text-secondary hover:underline">
          ← На главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;