"use client";

import { ALERTS } from "@/data/scenario";
import { Badge, CardHeader, cn } from "@/components/ui";
import { AlertItem } from "./AlertItem";

/*
 * Active alerts — AlertsPanel 53:4758 / 108:9425.
 * Desktop: 558 px card (border-secondary, radius 12, shadow-xs); header "Active alerts" / "7 open · most urgent first"
 *   with the md grey badge "N to acknowledge" on the right and a divider; the list scrolls INSIDE the card;
 *   footer "Scroll for all 7 alerts" + "View all alerts →" (inert — Alerts page not designed).
 * Mobile (59:1299): full-bleed white section, all alerts inline (no nested scroll), footer link only.
 */
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
    <ul className="flex w-full flex-col">
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
        className="hidden h-[558px] w-full flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-xs lg:flex"
      >
        {header("desktop")}
        <div className="min-h-0 flex-1 overflow-y-auto" tabIndex={0} aria-label="Alert list">
          {list("desktop")}
        </div>
        <div className={cn("flex items-center justify-between border-t border-border-secondary px-4 py-2.5")}>
          <p className="text-xs font-normal text-tertiary">Scroll for all {ALERTS.length} alerts</p>
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
