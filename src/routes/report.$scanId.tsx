import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Download, Share2, Droplets } from "lucide-react";
import { toast } from "sonner";
import { GradeBadge } from "@/components/GradeBadge";
import { useI18n } from "@/lib/i18n";
import { SAFE_MOISTURE_PCT } from "@/lib/grain-analysis";
import { defectsOf, getScan, getThumbnail } from "@/lib/scan-store";

export const Route = createFileRoute("/report/$scanId")({
  head: () => ({
    meta: [
      { title: "Grain quality report — GrainSense AI" },
      {
        name: "description",
        content:
          "Grade, defect breakdown, moisture safety and combined quality score for your paddy sample.",
      },
      { property: "og:title", content: "Grain quality report — GrainSense AI" },
      {
        property: "og:description",
        content: "Grade, defect breakdown and moisture safety for your paddy sample.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { scanId } = useParams({ from: "/report/$scanId" });
  const { t } = useI18n();
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => setThumb(getThumbnail(scanId)), [scanId]);

  const { data, isLoading } = useQuery({
    queryKey: ["scan", scanId],
    queryFn: () => getScan(scanId),
  });

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">{t("result.loading")}</p>;
  }
  if (!data) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">{t("result.notFound")}</p>;
  }

  const defects = defectsOf(data);
  const moisture = Number(data.moisture);
  const safe = moisture <= SAFE_MOISTURE_PCT;
  const score = Number(data.quality_score);

  const rows = [
    { label: t("result.broken"), value: defects.broken, color: "var(--chart-1)" },
    { label: t("result.chalky"), value: defects.chalky, color: "var(--chart-2)" },
    { label: t("result.foreign"), value: defects.foreign, color: "var(--chart-4)" },
    { label: t("result.immature"), value: defects.immature, color: "var(--chart-3)" },
  ];

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "GrainSense AI", url });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("result.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {new Date(data.created_at).toLocaleString()}
      </p>

      <div className="shadow-soft mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="bg-hero flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("result.grade")}</p>
            <div className="mt-2">
              <GradeBadge grade={data.grade} size="lg" />
            </div>
            <p
              className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${
                data.qualified ? "text-success" : "text-destructive"
              }`}
            >
              {data.qualified ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <AlertTriangle className="size-4" />
              )}
              {data.qualified ? t("result.qualified") : t("result.notQualified")}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">{t("result.score")}</p>
            <p className="text-5xl font-bold tracking-tight text-primary">{score}</p>
            <p className="text-sm text-muted-foreground">/ 100</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <h2 className="font-semibold">{t("result.defects")}</h2>
            <ul className="mt-4 space-y-3.5">
              {rows.map((r) => (
                <li key={r.label}>
                  <div className="flex justify-between text-sm">
                    <span>{r.label}</span>
                    <span className="font-semibold">{r.value}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, r.value * 5)}%`,
                        backgroundColor: r.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Droplets className="size-4" />
                {t("result.moisture")}
              </p>
              <p className="mt-1 text-3xl font-bold">{moisture}%</p>
              <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (moisture / 25) * 100)}%`,
                    backgroundColor: safe ? "var(--success)" : "var(--destructive)",
                  }}
                />
                <span
                  className="absolute top-0 h-full w-0.5 bg-foreground/50"
                  style={{ left: `${(SAFE_MOISTURE_PCT / 25) * 100}%` }}
                />
              </div>
              <p
                className={`mt-2 text-sm font-semibold ${safe ? "text-success" : "text-destructive"}`}
              >
                {safe ? t("result.safe") : t("result.unsafe")}
              </p>
              <p className="text-xs text-muted-foreground">{t("result.threshold")}</p>
            </div>

            {thumb && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("result.sample")}</p>
                <img
                  src={thumb}
                  alt={t("result.sample")}
                  loading="lazy"
                  className="mt-2 w-full rounded-2xl object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card font-semibold transition-colors hover:bg-secondary"
        >
          <Download className="size-5" />
          {t("result.download")}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card font-semibold transition-colors hover:bg-secondary"
        >
          <Share2 className="size-5" />
          {t("result.share")}
        </button>
        <Link
          to="/analyze"
          className="bg-leaf inline-flex h-14 flex-1 items-center justify-center rounded-2xl font-semibold text-primary-foreground"
        >
          {t("result.new")}
        </Link>
      </div>
    </div>
  );
}
