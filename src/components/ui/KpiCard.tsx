import type { FocusEvent, MouseEvent } from "react";
import { cn } from "./cn";

export interface KpiCardProps {
  label: string;
  value: string;
  /** Supporting line under the value. */
  line: string;
  /** "critical" = supporting line in error-700 semibold (e.g. "2 critical"). */
  tone?: "default" | "critical";
  /** Makes the whole card a link (the full-day view behind the number). */
  onClick?: () => void;
  className?: string;
}

/*
 * KPI card 15:1666 — kit Metric item (Simple) + one supporting line.
 * White, 1 px border-secondary, radius-xl 12, shadow-xs; metric pt 16 · px 16 · pb 4 · gap 4:
 * label Text sm/Medium text-tertiary, value Display sm/Semibold text-primary;
 * supporting px 16 · pb 16, Text xs/Regular text-tertiary (Critical: Text xs/Semibold error-700).
 * Interaction=Hover (clickable cards): fill bg-secondary + border-primary, the same one-step-darker rule
 * as table rows and gate tiles. Tailwind's hover only applies on devices that can hover, so touch
 * gets the same look only while pressed.
 */
export function KpiCard({ label, value, line, tone = "default", onClick, className }: KpiCardProps) {
  const body = (
    <>
      <div className="flex flex-col gap-1 px-4 pb-1 pt-4">
        <p className="text-sm font-medium text-tertiary">{label}</p>
        <p className="text-display-sm font-semibold text-primary">{value}</p>
      </div>
      <div className="flex items-center px-4 pb-4">
        <p className={cn("min-w-0 flex-1 text-xs", tone === "critical" ? "font-semibold text-error-700" : "font-normal text-tertiary")}>
          {line}
        </p>
      </div>
    </>
  );
  const base = "flex w-full flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-xs";

  if (!onClick) return <div className={cn(base, className)}>{body}</div>;

  return (
    <a
      href="#"
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick();
      }}
      // In the sideways-scrolling mobile strip the browser won't scroll a half-visible "peek" card into view on
      // Tab, so do it here (the strip's scroll-padding keeps the focus ring clear of the edge).
      onFocus={(e: FocusEvent<HTMLAnchorElement>) => {
        if (e.currentTarget.matches(":focus-visible")) e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
      }}
      className={cn(
        base,
        "transition-colors duration-100 hover:border-border-primary hover:bg-bg-secondary active:border-border-primary active:bg-bg-secondary",
        className,
      )}
    >
      {body}
    </a>
  );
}
