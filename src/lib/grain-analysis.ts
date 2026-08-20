/**
 * Grain analysis service layer.
 *
 * Everything the UI needs from the "AI + hardware" side lives behind these two
 * functions. To go live:
 *   1. Set VITE_CNN_ENDPOINT to the FastAPI/CNN inference URL — analyzeGrainImage
 *      will POST the image there instead of using the local mock.
 *   2. Set VITE_MOISTURE_ENDPOINT to the sensor gateway URL — readMoistureSensor
 *      will GET the live reading instead of the simulated one.
 * No component code needs to change.
 */

export const SAFE_MOISTURE_PCT = 14;

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
  moisture: number;
};

export type CnnPrediction = {
  defects: DefectBreakdown;
};

const CNN_ENDPOINT = import.meta.env["VITE_CNN_ENDPOINT"] as string | undefined;
const MOISTURE_ENDPOINT = import.meta.env["VITE_MOISTURE_ENDPOINT"] as string | undefined;

/** Deterministic pseudo-random value from a seed so the same file gives the same result. */
function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return +(min + frac * (max - min)).toFixed(1);
}

async function mockPredict(file: File): Promise<CnnPrediction> {
  await new Promise((r) => setTimeout(r, 1200));
  const seed = file.size + file.name.length;
  return {
    defects: {
      broken: seeded(seed, 1.5, 12),
      chalky: seeded(seed * 1.7, 1, 9),
      foreign: seeded(seed * 2.3, 0.2, 4),
      immature: seeded(seed * 3.1, 0.5, 7),
    },
  };
}

/** Sends the sample image to the CNN inference endpoint (mocked until configured). */
export async function predictDefects(file: File): Promise<CnnPrediction> {
  if (!CNN_ENDPOINT) return mockPredict(file);

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(CNN_ENDPOINT, { method: "POST", body });
  if (!res.ok) throw new Error(`CNN inference failed (${res.status})`);
  return (await res.json()) as CnnPrediction;
}

/** Reads the embedded moisture sensor (simulated until hardware gateway is configured). */
export async function readMoistureSensor(): Promise<number> {
  if (!MOISTURE_ENDPOINT) {
    await new Promise((r) => setTimeout(r, 700));
    return +(11 + Math.random() * 6).toFixed(1);
  }
  const res = await fetch(MOISTURE_ENDPOINT);
  if (!res.ok) throw new Error(`Moisture sensor unavailable (${res.status})`);
  const json = (await res.json()) as { moisture: number };
  return json.moisture;
}

export function gradeFromScore(score: number, moisture: number): Grade {
  if (moisture > 18 || score < 55) return "Reject";
  if (score >= 85 && moisture <= SAFE_MOISTURE_PCT) return "A";
  if (score >= 70) return "B";
  return "C";
}

export function scoreSample(defects: DefectBreakdown, moisture: number): number {
  const defectPenalty =
    defects.broken * 1.4 + defects.chalky * 1.2 + defects.foreign * 2.2 + defects.immature * 1.3;
  const moisturePenalty = Math.max(0, moisture - SAFE_MOISTURE_PCT) * 4;
  return +Math.max(0, Math.min(100, 100 - defectPenalty - moisturePenalty)).toFixed(1);
}

/** Full pipeline: image defects + moisture -> grade. */
export async function analyzeGrainSample(file: File, moisture: number): Promise<AnalysisResult> {
  const { defects } = await predictDefects(file);
  const qualityScore = scoreSample(defects, moisture);
  const grade = gradeFromScore(qualityScore, moisture);
  return {
    grade,
    qualityScore,
    defects,
    moisture,
    qualified: grade !== "Reject" && moisture <= SAFE_MOISTURE_PCT,
  };
}
