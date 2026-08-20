import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useI18n, languages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/analyze", label: t("nav.analyze") },
    { to: "/history", label: t("nav.history") },
  ] as const;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="bg-leaf flex size-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="truncate text-base font-semibold tracking-tight">{t("app.name")}</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-card p-1 sm:ml-2">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              aria-pressed={lang === l.code}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                lang === l.code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <nav className="no-print flex gap-1 border-t border-border/60 px-4 py-2 sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-muted-foreground"
            activeProps={{ className: "bg-secondary text-foreground" }}
            activeOptions={{ exact: item.to === "/" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
