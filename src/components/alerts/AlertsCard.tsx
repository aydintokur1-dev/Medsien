"use client";

import { useSyncExternalStore } from "react";
import { ALERTS } from "@/data/scenario";
import { Badge, CardHeader, cn } from "@/components/ui";
import { AlertItem } from "./AlertItem";

/*
 * Active alerts — AlertsPanel 53:4758 / 108:9425.
 * Desktop ≥ 1400 px: 558 px card (border-secondary, radius 12, shadow-xs); header "Active alerts" / "7 open · most urgent first"
 *   with the md grey badge "N to acknowledge" on the right and a divider; the list scrolls INSIDE the card;
 *   footer "Scroll for all 7 alerts" + "View all alerts →" (inert — Alerts page not designed).
 * 1024–1399 px (tablets in landscape): same card, but every alert shows in the page and there is no inner scroll —
 *   a scroll inside a scroll traps touch gestures (the rule the mobile design already follows). Footer = link only.
 * Mobile (59:1299): full-bleed white section, all alerts inline (no nested scroll), footer link only.
 */
const WIDE = "(min-width: 87.5rem)"; // --breakpoint-wide
function subscribeWide(onChange: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
export function AlertsCard({
  acknowledged,
  onAcknowledge,
  onView,
}: {
  /** alertId → "SK hh:mm" for alerts acknowledged in this session. */
  acknowledged: Map<string, string>;
  onAcknowledge: (alertId: string) => void;
  onView: (alertId: string) => void;
}) {
  // Only the ≥ 1400 px list scrolls, so only then is it its own tab stop (to scroll to alerts without buttons).
  const listScrolls = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);
  const ackOf = (id: string, fromData?: string) => fromData ?? acknowledged.get(id);
  const toAcknowledge = ALERTS.filter((a) => !ackOf(a.id, a.acknowledgedBy)).length;
  const badge = (
    <Badge color="gray" size="md" aria-label={`${toAcknowledge} alerts still to acknowledge`}>
      {toAcknowledge} to acknowledge
    </Badge>
  );
  const header = (layout: "desktop" | "mobile") => (
    <CardHeader
      title="Active alerts"
      helper={`${ALERTS.length} open · most urgent first`}
      right={badge}
      rightAlign="center"
      divider
      titleId={`alerts-title-${layout}`}
      contentClassName={layout === "mobile" ? "px-4 pt-4" : undefined}
    />
  );
  const list = (layout: "desktop" | "mobile") => (
    // Card layouts: the footer's top border already closes the list, so the last alert drops its own (no 2 px line).
    <ul className={cn("flex w-full flex-col", layout === "desktop" && "[&>li:last-child]:border-b-0")}>
      {ALERTS.map((a) => (
        <AlertItem
          key={a.id}
          alert={a}
          layout={layout}
          acknowledgedBy={ackOf(a.id, a.acknowledgedBy)}
          onAcknowledge={() => onAcknowledge(a.id)}
          onView={() => onView(a.id)}
        />
      ))}
    </ul>
  );
  const viewAll = (
    <a href="#" onClick={(e) => e.preventDefault()} title="Alerts page (not designed in this case study)" className="whitespace-nowrap text-sm font-semibold text-brand-hover hover:underline hover:underline-offset-2">
      View all alerts →
    </a>
  );

  return (
    <>
      {/* Desktop */}
      <section
        aria-labelledby="alerts-title-desktop"
        className="hidden w-full flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-xs lg:flex wide:h-[558px]"
      >
        {header("desktop")}
        <div
          className="wide:min-h-0 wide:flex-1 wide:overflow-y-auto"
          {...(listScrolls ? { role: "region", tabIndex: 0, "aria-label": "Alert list, scrolls" } : {})}
        >
          {list("desktop")}
        </div>
        <div className={cn("flex items-center justify-between border-t border-border-secondary px-4 py-2.5")}>
          <p className="hidden text-xs font-normal text-tertiary wide:block">Scroll for all {ALERTS.length} alerts</p>
          {viewAll}
        </div>
      </section>

      {/* Mobile */}
      <section aria-labelledby="alerts-title-mobile" className="w-full border-y border-border-secondary bg-bg-primary lg:hidden">
        {header("mobile")}
        {list("mobile")}
        <div className="flex min-h-11 items-center px-4 py-3">{viewAll}</div>
      </section>
    </>
  );
}
