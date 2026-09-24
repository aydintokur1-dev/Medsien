import { cn } from "./cn";

export interface KpiCardProps {
  label: string;
  value: string;
  /** Supporting line under the value. */
  line: string;
  /** "critical" = supporting line in error-700 semibold (e.g. "2 critical"). */
  tone?: "default" | "critical";
  className?: string;
}

/*
 * KPI card 15:1666 — kit Metric item (Simple) + one supporting line.
 * White, 1 px border-secondary, radius-xl 12, shadow-xs; metric pt 16 · px 16 · pb 4 · gap 4:
 * label Text sm/Medium text-tertiary, value Display sm/Semibold text-primary;
 * supporting px 16 · pb 16, Text xs/Regular text-tertiary (Critical: Text xs/Semibold error-700).
 */
export function KpiCard({ label, value, line, tone = "default", className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-xs",
        className,
      )}
    >
      <div className="flex flex-col gap-1 px-4 pb-1 pt-4">
        <p className="text-sm font-medium text-tertiary">{label}</p>
        <p className="text-display-sm font-semibold text-primary">{value}</p>
      </div>
      <div className="flex items-center px-4 pb-4">
        <p className={cn("min-w-0 flex-1 text-xs", tone === "critical" ? "font-semibold text-error-700" : "font-normal text-tertiary")}>
          {line}
        </p>
      </div>
    </div>
  );
}
