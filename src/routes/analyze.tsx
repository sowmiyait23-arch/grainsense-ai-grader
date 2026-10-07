import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, ImageUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { analyzeGrainSample } from "@/lib/grain-analysis";
import { makeThumbnail, saveReason, saveScan, saveThumbnail } from "@/lib/scan-store";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a paddy sample — GrainSense AI" },
      {
        name: "description",
        content:
          "Upload or capture a paddy grain photo and get an instant AI quality grade.",
      },
      { property: "og:title", content: "Analyze a paddy sample — GrainSense AI" },
      {
        property: "og:description",
        content: "Upload or capture a grain photo and get an instant AI quality grade.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  function acceptFile(f: File | undefined) {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onAnalyze() {
    if (!file) {
      toast.error(t("upload.needImage"));
      return;
    }
    setBusy(true);
    try {
      const result = await analyzeGrainSample(file);
      const scan = await saveScan(result);
      if (result.reason) saveReason(scan.id, result.reason);
      try {
        saveThumbnail(scan.id, await makeThumbnail(file));
      } catch {
        /* thumbnail is optional */
      }
      navigate({ to: "/report/$scanId", params: { scanId: scan.id } });
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error && err.message === "NOT_GRAIN" ? t("upload.notGrain") : t("upload.failed"),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("upload.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("upload.subtitle")}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          acceptFile(e.dataTransfer.files[0]);
        }}
        className={`mt-6 rounded-3xl border-2 border-dashed p-5 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border bg-card"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt={t("result.sample")}
            className="mx-auto max-h-72 w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="py-8">
            <ImageUp className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 font-medium">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("upload.or")}</p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-5 py-3.5 font-semibold transition-colors hover:bg-secondary"
          >
            <ImageUp className="size-5" />
            {preview ? t("upload.change") : t("upload.browse")}
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-5 py-3.5 font-semibold transition-colors hover:bg-secondary"
          >
            <Camera className="size-5" />
            {t("upload.camera")}
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={busy}
        className="bg-leaf shadow-soft mt-6 inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {busy && <Loader2 className="size-5 animate-spin" />}
        {busy ? t("upload.analyzing") : t("upload.analyze")}
      </button>
    </div>
  );
}
