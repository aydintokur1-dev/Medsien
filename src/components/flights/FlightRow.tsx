"use client";

import type { Flight } from "@/data/scenario";
import { SeverityBadge, StatusBadge, cn } from "@/components/ui";

/*
 * Mobile Flight row 55:1266 — px 16 · py 12 · gap 12, 1 px border-secondary bottom; the whole row is the tap target.
 * Left: flight (Text sm/Semibold) + linked-alert SeverityBadge, route (secondary), airline · direction (tertiary).
 * Right (end-aligned, gap 4): StatusBadge; "sched → est" (est only when it changed; colour follows the status);
 * "Gate B06" (Medium, primary) + gate note (Text xs/Medium, warning-700).
 * Cancelled: all text muted, scheduled time struck through.
 */
const EST: Record<Flight["estTone"], string> = {
  same: "text-tertiary",
  "delayed-long": "font-medium text-orange-700",
  delayed: "font-medium text-warning-700",
  early: "font-medium text-primary",
  none: "text-quaternary",
};

/** onOpen only for the flight whose detail is designed (MD241); other rows are static, as in Figma. */
export function FlightRow({ f, selected, onOpen }: { f: Flight; selected: boolean; onOpen?: () => void }) {
  const cancelled = f.status.kind === "cancelled";
  const showEst = f.estTone !== "same" && f.estTone !== "none";
  const rowClass = "flex w-full items-start gap-3 border-b border-border-secondary px-4 py-3 text-left";
  const content = (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-semibold", cancelled ? "text-quaternary" : "text-primary")}>
            {f.id}
            {f.illustrative && " *"}
          </span>
          {f.alert && <SeverityBadge severity={f.alert} />}
        </div>
        <span className={cn("truncate text-sm font-normal", cancelled ? "text-quaternary" : "text-secondary")}>
          {f.from} → {f.to}
        </span>
        <span className={cn("truncate text-sm font-normal", cancelled ? "text-quaternary" : "text-tertiary")}>
          {f.airline} · {f.direction}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <StatusBadge kind={f.status.kind} label={f.status.label} />
        <span className="flex items-center gap-1 whitespace-nowrap text-sm">
          <span className={cancelled ? "text-quaternary line-through" : "text-tertiary"}>{f.sched}</span>
          {showEst && (
            <>
              <span className="text-tertiary">→</span>
              <span className={EST[f.estTone]}>{f.est}</span>
              </>
            )}
          </span>
          <span className={cn("whitespace-nowrap text-sm font-medium", cancelled ? "text-quaternary" : "text-primary")}>Gate {f.gate}</span>
          {f.gateNote && <span className="whitespace-nowrap text-xs font-medium text-warning-700">{f.gateNote}</span>}
        </div>
    </>
  );
  return (
    <li>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${f.id}${f.illustrative ? " (illustrative)" : ""}, ${f.from} to ${f.to}, ${f.status.label}, gate ${f.gate}. Open details`}
          className={cn(rowClass, "transition-colors active:bg-bg-secondary", selected ? "bg-bg-secondary" : "bg-bg-primary")}
        >
          {content}
        </button>
      ) : (
        <div className={cn(rowClass, "bg-bg-primary")}>{content}</div>
      )}
    </li>
  );
}
