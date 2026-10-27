import { createContext, useContext, type ReactNode } from "react";

/**
 * All UI strings live here. English is the only supported language; every
 * component reads text through the `t()` helper.
 */
const en = {
  "app.name": "GrainSense AI",
  "app.tagline": "AI paddy grain quality grading",
  "nav.home": "Home",
  "nav.analyze": "Analyze",
  "nav.history": "History",

  "hero.badge": "MSME Idea Hackathon 5.0",
  "hero.title": "Grade your paddy in seconds, not hours",
  "hero.subtitle":
    "Manual grain grading is slow, inconsistent and subjective. GrainSense AI uses CNN-based visual defect analysis to give farmers, FPOs and procurement centres one instant, objective quality report from a single photo.",
  "hero.cta": "Try it now",
  "hero.secondary": "See past scans",
  "hero.imageAlt": "Golden paddy grains on natural linen",

  "problem.title": "Why grading needs to change",
  "problem.1.title": "Slow manual sampling",
  "problem.1.body": "Hand sorting a sample takes 20–30 minutes per lot at the procurement gate.",
  "problem.2.title": "Subjective judgement",
  "problem.2.body": "Two inspectors often grade the same lot differently, causing disputes over price.",
  "problem.3.title": "Defects go unnoticed",
  "problem.3.body": "Broken, chalky and immature grains slip through quick visual checks and lower the lot's value.",

  "how.title": "How it works",
  "how.subtitle": "Three steps, under a minute.",
  "how.1.title": "Upload or capture",
  "how.1.body": "Spread a sample, take a photo with your phone or drop an image in.",
  "how.2.title": "AI analyzes",
  "how.2.body": "The CNN model detects broken, chalky, immature grains and foreign matter.",
  "how.3.title": "Get graded report",
  "how.3.body": "Grade, defect breakdown and a shareable summary card.",

  "upload.title": "Upload & analyze",
  "upload.subtitle": "Take or upload a clear photo of the grain sample — the AI does the rest.",
  "upload.drop": "Drag & drop a grain sample photo",
  "upload.or": "or",
  "upload.browse": "Choose file",
  "upload.camera": "Use camera",
  "upload.change": "Replace photo",
  "upload.analyze": "Analyze sample",
  "upload.analyzing": "Analyzing…",
  "upload.needImage": "Please add a photo of the grain sample first.",
  "upload.failed": "Analysis failed. Please try again.",

  "result.title": "Quality report",
  "result.grade": "Overall grade",
  "result.qualified": "Healthy",
  "result.notQualified": "Not healthy",
  "result.verdict": "Verdict",
  "result.healthyBody": "This sample is healthy — good to store or sell.",
  "result.notHealthyBody": "This sample is not healthy — check defects before storage.",
  "result.score": "Combined quality score",
  "result.defects": "Defect breakdown",
  "result.broken": "Broken grains",
  "result.chalky": "Chalky / discoloured",
  "result.foreign": "Foreign matter",
  "result.immature": "Immature grains",
  "result.aiReason": "AI observation",
  "upload.notGrain": "This image is not in the expected format — please upload a clear photo of paddy grains only.",
  "result.sample": "Sample image",
  "result.download": "Download / print report",
  "result.share": "Share",
  "result.new": "Analyze another sample",
  "result.notFound": "Report not found.",
  "result.loading": "Loading report…",
  "result.recommend": "Recommendation",

  "history.title": "Scan history",
  "history.subtitle": "Every sample you have graded on this device.",
  "history.empty": "No scans yet. Analyze your first sample.",
  "history.filterGrade": "Filter by grade",
  "history.all": "All grades",
  "history.from": "From date",
  "history.clear": "Clear filters",
  "history.view": "View report",
  "history.loading": "Loading scans…",

  "common.grade": "Grade",
  "common.date": "Date",
  "common.back": "Back",
  "footer.note": "Prototype — the CNN inference endpoint is a pluggable stub.",
};

export type TranslationKey = keyof typeof en;

type I18nValue = {
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = (key: TranslationKey) => en[key] ?? key;
  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
