import { AlertTriangle, ClockRefresh } from "@untitledui/icons";
import { FRESHNESS } from "@/data/scenario";
import { cn } from "./cn";
import { iconStroke } from "./icon";

export type FreshnessState = "live" | "current" | "overdue";
export type FreshnessStyle = "chip" | "inline";

export interface FreshnessIndicatorProps {
  state: FreshnessState;
  style: FreshnessStyle;
  /** Defaults to the scenario copy: "Flights live" / "Gates as of 10:00 · next 10:15" / "Gates overdue · 22 min old". */
  label?: string;
  className?: string;
}

const DEFAULT_LABEL: Record<FreshnessState, string> = {
  live: FRESHNESS.flights.label,
  current: FRESHNESS.gates.label,
  overdue: FRESHNESS.gates.overdueLabel,
};

/** 12 px live dot: success-100 halo with a 6 px success-500 core (Figma "Live dot"). */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("flex size-3 shrink-0 items-center justify-center rounded-full bg-success-100", className)}>
      <span className="size-1.5 rounded-full bg-success-500" />
    </span>
  );
}

/**
 * Figma FreshnessIndicator 12:99 (+ State=Live, Style=Inline 166:1686).
 * Chip = page header (white, border-secondary, radius 8, px 10 · py 6, gap 8).
 * Inline = text only inside cards (no border / padding); Live keeps its dot.
 */
export function FreshnessIndicator({ state, style, label, className }: FreshnessIndicatorProps) {
  const text = label ?? DEFAULT_LABEL[state];
  const chip = style === "chip";

  const textClass =
    state === "overdue"
      ? "font-medium text-warning-700"
      : chip
        ? "font-medium text-secondary"
        : "font-normal text-tertiary";

  return (
    <span
      className={cn(
        "inline-flex w-max max-w-full items-center",
        chip ? "gap-2 rounded-md border border-border-secondary bg-bg-primary px-2.5 py-1.5" : "gap-2",
        className,
      )}
    >
      {state === "live" && <LiveDot />}
      {chip && state === "current" && (
        <ClockRefresh size={14} strokeWidth={iconStroke(14)} className="shrink-0 text-quaternary" />
      )}
      {chip && state === "overdue" && (
        <AlertTriangle size={14} strokeWidth={iconStroke(14)} className="shrink-0 text-warning-600" />
      )}
      <span className={cn("whitespace-nowrap text-sm", textClass)}>{text}</span>
    </span>
  );
}
