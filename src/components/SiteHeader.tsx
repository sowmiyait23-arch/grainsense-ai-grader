import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useI18n();

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

        <nav className="ml-auto flex items-center gap-1">
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
      </div>
    </header>
  );
}
