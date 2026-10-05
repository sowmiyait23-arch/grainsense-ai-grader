import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult, DefectBreakdown, Grade } from "./grain-analysis";

export type ScanRecord = {
  id: string;
  created_at: string;
  moisture: number;
  grade: Grade;
  quality_score: number;
  qualified: boolean;
  broken_pct: number;
  chalky_pct: number;
  foreign_pct: number;
  immature_pct: number;
};

const DEVICE_KEY = "grainsense.device";
const THUMB_PREFIX = "grainsense.thumb.";

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/** Downscaled sample thumbnail kept on-device (keeps the app fast on slow connections). */
export function saveThumbnail(id: string, dataUrl: string) {
  try {
    localStorage.setItem(THUMB_PREFIX + id, dataUrl);
  } catch {
    /* quota — thumbnails are optional */
  }
}

export function getThumbnail(id: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(THUMB_PREFIX + id);
}

export async function makeThumbnail(file: File, max = 480): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

export async function saveScan(result: AnalysisResult): Promise<ScanRecord> {
  const { data, error } = await supabase
    .from("grain_scans")
    .insert({
      device_id: getDeviceId(),
      moisture: result.moisture,
      grade: result.grade,
      quality_score: result.qualityScore,
      qualified: result.qualified,
      broken_pct: result.defects.broken,
      chalky_pct: result.defects.chalky,
      foreign_pct: result.defects.foreign,
      immature_pct: result.defects.immature,
    })
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ScanRecord;
}

export async function listScans(): Promise<ScanRecord[]> {
  const { data, error } = await supabase
    .from("grain_scans")
    .select("*")
    .eq("device_id", getDeviceId())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ScanRecord[];
}

export async function getScan(id: string): Promise<ScanRecord | null> {
  const { data, error } = await supabase.from("grain_scans").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as ScanRecord) ?? null;
}

export function defectsOf(scan: ScanRecord): DefectBreakdown {
  return {
    broken: Number(scan.broken_pct),
    chalky: Number(scan.chalky_pct),
    foreign: Number(scan.foreign_pct),
    immature: Number(scan.immature_pct),
  };
}

const REASON_PREFIX = "grainsense.reason.";
export function saveReason(id: string, reason: string) {
  try {
    localStorage.setItem(REASON_PREFIX + id, reason);
  } catch {
    /* optional */
  }
}
export function getReason(id: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REASON_PREFIX + id);
}
