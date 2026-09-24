"use client";

import { AlertOctagon, AlertTriangle, ArrowRight, InfoCircle } from "@untitledui/icons";
import type { Alert, Severity } from "@/data/scenario";
import { Tag, cn, iconStroke } from "@/components/ui";

/*
 * AlertItem 14:14179 — px 16 · py 12 · gap 12, 1 px border-secondary bottom.
 * 32 px severity circle (error-100 / warning-100 / blue-100; acknowledged = gray-100) with a 16 px icon —
 * the SHAPE encodes severity (octagon / triangle / circle) and is kept when acknowledged.
 * Title Text sm/Semibold primary (acknowledged: Medium, secondary) + age Text xs quaternary;
 * why Text sm tertiary; impact → Text xs/Medium secondary; meta: owner + link chips, then actions
 * (Acknowledge = link-gray, View = link-color) or "Acknowledged · SK hh:mm".
 * Mobile: chips wrap, actions on their own line with 44 px tap targets.
 */
const SEVERITY: Record<Severity, { circle: string; icon: typeof AlertOctagon; iconColor: string; label: string }> = {
  critical: { circle: "bg-error-100", icon: AlertOctagon, iconColor: "text-error-600", label: "Critical" },
  warning: { circle: "bg-warning-100", icon: AlertTriangle, iconColor: "text-warning-600", label: "Warning" },
  info: { circle: "bg-blue-100", icon: InfoCircle, iconColor: "text-blue-600", label: "Info" },
};

export function AlertItem({
  alert,
  acknowledgedBy,
  onAcknowledge,
  onView,
  layout,
}: {
  alert: Alert;
  /** "SK 09:58" when acknowledged (from data or this session). */
  acknowledgedBy?: string;
  onAcknowledge: () => void;
  onView: () => void;
  layout: "desktop" | "mobile";
}) {
  const s = SEVERITY[alert.severity];
  const Icon = s.icon;
  const acked = Boolean(acknowledgedBy);
  const mobile = layout === "mobile";

  const chips = (
    <div className={cn("flex items-center gap-1.5", mobile ? "flex-wrap" : "min-w-0")}>
      <Tag>{alert.owner}</Tag>
      {alert.links.map((l) => (
        <Tag key={l}>{l}</Tag>
      ))}
    </div>
  );

  const actions = acked ? (
    <p className="whitespace-nowrap text-xs font-medium text-quaternary">Acknowledged · {acknowledgedBy}</p>
  ) : (
    <div className={cn("flex items-center", mobile ? "gap-5" : "gap-3")}>
      <button
        type="button"
        onClick={onAcknowledge}
        className={cn("whitespace-nowrap text-sm font-semibold text-tertiary transition-colors hover:text-secondary", mobile && "min-h-11")}
      >
        Acknowledge
      </button>
      <button
        type="button"
        onClick={onView}
        className={cn("whitespace-nowrap text-sm font-semibold text-brand-hover transition-colors hover:underline hover:underline-offset-2", mobile && "min-h-11")}
      >
        View
      </button>
    </div>
  );

  return (
    <li className="flex w-full items-start gap-3 border-b border-border-secondary bg-bg-primary px-4 py-3">
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", acked ? "bg-gray-100" : s.circle)}>
        <Icon size={16} strokeWidth={iconStroke(16)} className={acked ? "text-quaternary" : s.iconColor} aria-hidden="true" />
        <span className="sr-only">{s.label}{acked ? ", acknowledged" : ""}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("min-w-0 flex-1 text-sm", acked ? "font-medium text-secondary" : "font-semibold text-primary")}>{alert.title}</p>
          <p className="shrink-0 whitespace-nowrap text-xs font-normal text-quaternary">{alert.age}</p>
        </div>
        <p className="text-sm font-normal text-tertiary">{alert.why}</p>
        <div className="flex items-start gap-1.5">
          <ArrowRight size={12} strokeWidth={iconStroke(12)} className="mt-[3px] shrink-0 text-quaternary" aria-hidden="true" />
          <p className="text-xs font-medium text-secondary">{alert.impact}</p>
        </div>
        {mobile ? (
          <div className="flex flex-col gap-1 pt-1.5">
            {chips}
            {actions}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 pt-1">
            {chips}
            {actions}
          </div>
        )}
      </div>
    </li>
  );
}
