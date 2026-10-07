/**
 * Grain analysis service layer.
 *
 * Everything the UI needs from the "AI" side lives behind these functions.
 * To go live with a custom model, set VITE_CNN_ENDPOINT to the FastAPI/CNN
 * inference URL — analyzeGrainSample will POST the image there instead of
 * using Lovable AI vision. No component code needs to change.
 */

export type DefectBreakdown = {
  broken: number;
  chalky: number;
  foreign: number;
  immature: number;
};

export type Grade = "A" | "B" | "C" | "Reject";

export type AnalysisResult = {
  grade: Grade;
  qualityScore: number;
  qualified: boolean;
  defects: DefectBreakdown;
  reason?: string | undefined;
};

export type CnnPrediction = {
  defects: DefectBreakdown;
};

const CNN_ENDPOINT = import.meta.env["VITE_CNN_ENDPOINT"] as string | undefined;

/** Sends the sample image to the CNN inference endpoint. */
export async function predictDefects(file: File): Promise<CnnPrediction> {
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(CNN_ENDPOINT!, { method: "POST", body });
  if (!res.ok) throw new Error(`CNN inference failed (${res.status})`);
  return (await res.json()) as CnnPrediction;
}

export function gradeFromScore(score: number): Grade {
  if (score < 55) return "Reject";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  return "C";
}

export function scoreSample(defects: DefectBreakdown): number {
  const defectPenalty =
    defects.broken * 1.4 + defects.chalky * 1.2 + defects.foreign * 2.2 + defects.immature * 1.3;
  return +Math.max(0, Math.min(100, 100 - defectPenalty)).toFixed(1);
}

async function toDataUrl(file: File, max = 1024): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Full pipeline: image defects -> grade + Healthy/Not healthy verdict.
 * Uses the custom CNN when VITE_CNN_ENDPOINT is set, otherwise Lovable AI vision.
 */
export async function analyzeGrainSample(file: File): Promise<AnalysisResult> {
  let defects: DefectBreakdown;
  let visuallyHealthy = true;
  let reason: string | undefined;

  if (CNN_ENDPOINT) {
    defects = (await predictDefects(file)).defects;
  } else {
    const { assessGrainWithAI } = await import("./grain-ai.functions");
    const ai = await assessGrainWithAI({ data: { imageDataUrl: await toDataUrl(file) } });
    if (!ai.isGrainImage) throw new Error("NOT_GRAIN");
    defects = { broken: ai.broken, chalky: ai.chalky, foreign: ai.foreign, immature: ai.immature };
    visuallyHealthy = ai.healthy;
    reason = ai.reason;
  }

  const qualityScore = scoreSample(defects);
  const grade = gradeFromScore(qualityScore);
  return {
    grade,
    qualityScore,
    defects,
    reason,
    qualified: visuallyHealthy && grade !== "Reject",
  };
}
