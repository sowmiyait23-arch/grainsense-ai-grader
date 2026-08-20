import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ScanLine, FileCheck2, Clock3, Scale, Droplets, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-paddy.jpg";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GrainSense AI — Instant paddy grain quality grading" },
      {
        name: "description",
        content:
          "Upload a paddy sample photo and get an AI grade in seconds: defect breakdown, moisture safety and a shareable quality report for farmers, FPOs and procurement centres.",
      },
      { property: "og:title", content: "GrainSense AI — Instant paddy grain quality grading" },
      {
        property: "og:description",
        content:
          "CNN-based grain defect analysis plus moisture sensing gives one objective quality grade in under a minute.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();

  const problems = [
    { icon: Clock3, title: t("problem.1.title"), body: t("problem.1.body") },
    { icon: Scale, title: t("problem.2.title"), body: t("problem.2.body") },
    { icon: Droplets, title: t("problem.3.title"), body: t("problem.3.body") },
  ];

  const steps = [
    { icon: Camera, title: t("how.1.title"), body: t("how.1.body") },
    { icon: ScanLine, title: t("how.2.title"), body: t("how.2.body") },
    { icon: FileCheck2, title: t("how.3.title"), body: t("how.3.body") },
  ];

  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <span className="inline-flex rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-medium text-primary">
              {t("hero.badge")}
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/analyze"
                className="bg-leaf shadow-soft inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-7 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("hero.cta")}
                <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/history"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-border bg-card px-7 text-base font-semibold transition-colors hover:bg-secondary"
              >
                {t("hero.secondary")}
              </Link>
            </div>
          </div>

          <div className="shadow-soft overflow-hidden rounded-3xl">
            <img
              src={heroImage}
              alt={t("hero.imageAlt")}
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("problem.title")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {problems.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-5">
              <p.icon className="size-6 text-grain-earth" />
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("how.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("how.subtitle")}</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="shadow-soft rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="bg-leaf flex size-11 items-center justify-center rounded-xl text-primary-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link
              to="/analyze"
              className="bg-leaf inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-7 text-base font-semibold text-primary-foreground"
            >
              {t("hero.cta")}
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
