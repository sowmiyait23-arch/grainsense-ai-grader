import { cn } from "@/lib/utils";
import type { Grade } from "@/lib/grain-analysis";

const styles: Record<Grade, string> = {
  A: "bg-primary text-primary-foreground",
  B: "bg-grain-leaf/85 text-primary-foreground",
  C: "bg-accent text-accent-foreground",
  Reject: "bg-destructive text-destructive-foreground",
};

export function GradeBadge({
  grade,
  size = "md",
  label,
}: {
  grade: Grade;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tracking-tight",
        styles[grade],
        size === "sm" && "px-3 py-1 text-xs",
        size === "md" && "px-4 py-1.5 text-sm",
        size === "lg" && "px-7 py-3 text-2xl",
      )}
    >
      {label ?? (grade === "Reject" ? grade : `Grade ${grade}`)}
    </span>
  );
}
