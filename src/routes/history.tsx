import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { useI18n } from "@/lib/i18n";
import { getThumbnail, listScans } from "@/lib/scan-store";
import { SAFE_MOISTURE_PCT } from "@/lib/grain-analysis";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan history — GrainSense AI" },
      {
        name: "description",
        content: "Browse and filter every paddy sample graded on this device by grade or date.",
      },
      { property: "og:title", content: "Scan history — GrainSense AI" },
      {
        property: "og:description",
        content: "Browse and filter every paddy sample you have graded.",
      },
    ],
  }),
  component: HistoryPage,
});

const grades = ["A", "B", "C", "Reject"] as const;

function HistoryPage() {
  const { t } = useI18n();
  const [grade, setGrade] = useState<string>("all");
  const [from, setFrom] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["scans"], queryFn: listScans });

  const scans = useMemo(() => {
    return (data ?? []).filter((s) => {
      if (grade !== "all" && s.grade !== grade) return false;
      if (from && new Date(s.created_at) < new Date(from)) return false;
      return true;
    });
  }, [data, grade, from]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("history.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("history.subtitle")}</p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="grade" className="text-sm font-medium text-muted-foreground">
            {t("history.filterGrade")}
          </label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="mt-1.5 block h-12 rounded-xl border border-input bg-card px-3 font-medium"
          >
            <option value="all">{t("history.all")}</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="from" className="text-sm font-medium text-muted-foreground">
            {t("history.from")}
          </label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1.5 block h-12 rounded-xl border border-input bg-card px-3 font-medium"
          />
        </div>
        {(grade !== "all" || from) && (
          <button
            type="button"
            onClick={() => {
              setGrade("all");
              setFrom("");
            }}
            className="h-12 rounded-xl border border-border px-4 font-medium transition-colors hover:bg-secondary"
          >
            {t("history.clear")}
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="mt-10 text-muted-foreground">{t("history.loading")}</p>
      ) : scans.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          {t("history.empty")}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {scans.map((s) => {
            const thumb = getThumbnail(s.id);
            const safe = Number(s.moisture) <= SAFE_MOISTURE_PCT;
            return (
              <li key={s.id}>
                <Link
                  to="/report/$scanId"
                  params={{ scanId: s.id }}
                  className="shadow-soft flex items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      loading="lazy"
                      className="size-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="size-16 shrink-0 rounded-xl bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 font-semibold">
                      {t("common.moisture")}:{" "}
                      <span className={safe ? "text-success" : "text-destructive"}>
                        {Number(s.moisture)}%
                      </span>
                      <span className="ml-3 text-muted-foreground">{s.quality_score}/100</span>
                    </p>
                  </div>
                  <GradeBadge grade={s.grade} size="sm" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
