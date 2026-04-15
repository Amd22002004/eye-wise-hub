import { Eye } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-10">
    <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">ОфтальмоВики</span>
      </div>
      <p>© 2025 ОфтальмоВики. Информация не заменяет консультацию врача.</p>
    </div>
  </footer>
);

export default Footer;
