const Footer = () => (
  <footer className="border-t border-border bg-card py-10">
    <div className="container flex flex-col items-center gap-6 text-center">
      {/* Main branding */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg font-semibold text-foreground">Ассоциация офтальмологических клиник</span>
        <span className="text-base text-muted-foreground">ОфтальмоВики — справочник для пациентов и специалистов</span>
      </div>

      {/* Legal info */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground/70">
        <span>ОГРН: 1234567890123</span>
        <span className="hidden sm:inline">·</span>
        <span>ИНН/КПП: 1234567890 / 123456789</span>
      </div>

      {/* Copyright */}
      <p className="text-sm text-muted-foreground/60">
        © 2025 Ассоциация офтальмологических клиник. Информация не заменяет консультацию врача.
      </p>
    </div>
  </footer>
);

export default Footer;
