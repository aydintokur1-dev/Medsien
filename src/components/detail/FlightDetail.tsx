"use client";

import { useEffect, useState } from "react";
import { Check, Plane, XClose } from "@untitledui/icons";
import { ALERTS, FLIGHTS, FLIGHT_DETAIL_MD241, NOW, type Flight } from "@/data/scenario";
import { AssumptionTag, Button, FreshnessIndicator, IconButton, SeverityBadge, StatusBadge, Tag, cn, iconStroke } from "@/components/ui";
import { useDialog } from "./useDialog";

/*
 * Flight detail — desktop slide-out 22:6766 (480 px, white, border-l, shadow-xl, over a light overlay) and
 * the mobile sheet 65:2052 (grabber, rounded-2xl top, dimmed page). Same content on both.
 * Header: 40 px featured icon (plane) + title Text xl/Semibold + route Text md/Regular primary; × top-right.
 * Content (px 24 · pt 16 · pb 24 · gap 20): status row → Times → Delay reason → Gate → Details → Activity;
 * sections have a 1 px border-secondary top line, pt 16, title Text sm/Semibold secondary, gap 10.
 * Footer (border-t, px 24 · py 16, right-aligned): "Notify gate agent" (secondary, not designed) + "Acknowledge alert".
 * Only MD241 is designed in full; other flights show the same shell with the data we have (no invented sections).
 */

const minutesBetween = (from: string, to: string) => {
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  return th * 60 + tm - (fh * 60 + fm);
};
const fmtDuration = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);

function Section({ title, right, children, className }: { title: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex w-full flex-col gap-2.5 border-t border-border-secondary pt-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-secondary">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  );
}

function FeaturedIcon() {
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center rounded-md border border-border-secondary bg-bg-primary shadow-[0_1px_2px_0_rgb(10_13_18/0.05),inset_0_0_0_1px_rgb(10_13_18/0.18),inset_0_-2px_0_0_rgb(10_13_18/0.05)]">
      <Plane size={20} strokeWidth={iconStroke(20)} className="text-secondary" />
    </div>
  );
}

function ConflictTile({ label }: { label: string }) {
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-dashed border-warning-600 bg-bg-tertiary">
      <span className="text-xs font-medium text-tertiary">{label}</span>
      <span aria-hidden="true" className="absolute right-[5px] top-[3px] size-1.5 rounded-full bg-warning-600" />
    </div>
  );
}

function DetailBody({ flight }: { flight: Flight }) {
  const md241 = flight.id === FLIGHT_DETAIL_MD241.flightId;
  const d = FLIGHT_DETAIL_MD241;
  const est = flight.est;
  const isDep = flight.direction === "Departure";
  const timeUntil = est ? minutesBetween(NOW.time, est) : null;
  const estColor =
    flight.estTone === "delayed-long" ? "text-orange-700" : flight.estTone === "delayed" ? "text-warning-700" : "text-primary";
  const changed = flight.estTone !== "same" && flight.estTone !== "none";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge kind={flight.status.kind} label={flight.status.label} />
          {flight.alert && <SeverityBadge severity={flight.alert} />}
        </div>
        <Section title="Times">
          <div className="flex w-full items-start gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-xs font-medium text-tertiary">Scheduled</p>
              <p className={cn("text-lg font-semibold", changed || !est ? "text-quaternary line-through" : "text-primary")}>{flight.sched}</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-xs font-medium text-tertiary">Estimated</p>
              <p className={cn("text-lg font-semibold", est ? estColor : "text-quaternary")}>{est ?? "—"}</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-xs font-medium text-tertiary">{isDep ? "Departs in" : "Arrives in"}</p>
              <p className="text-lg font-semibold text-primary">
                {md241 ? d.times.departsIn : timeUntil !== null && timeUntil > 0 ? fmtDuration(timeUntil) : "—"}
              </p>
            </div>
          </div>
        </Section>
      </div>

      {md241 && (
        <Section title="Delay reason">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-normal text-primary">{d.delayReason.text}</p>
            <Tag>{d.delayReason.code}</Tag>
            <AssumptionTag />
          </div>
        </Section>
      )}

      <Section title="Gate" right={<FreshnessIndicator state="current" style="inline" />} className="gap-4">
        <div className="flex w-full items-start gap-3">
          {md241 ? (
            <ConflictTile label={d.gate.gate} />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-bg-tertiary ring-1 ring-inset ring-border-secondary">
              <span className="text-xs font-medium text-tertiary">{flight.gate}</span>
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-sm font-medium text-primary">{md241 ? d.gate.title : `Gate ${flight.gate}`}</p>
            {md241 ? (
              <p className="text-xs font-normal text-tertiary">
                {d.gate.lines[0]}
                <br />
                {d.gate.lines[1]}
              </p>
            ) : (
              flight.gateNote && <p className="text-xs font-medium text-warning-700">{flight.gateNote}</p>
            )}
          </div>
        </div>
      </Section>

      {md241 && (
        <Section title="Details">
          <dl className="flex w-full flex-col gap-2 text-sm">
            {d.details.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4">
                <dt className="font-normal text-tertiary">{row.label}</dt>
                <dd className="font-medium text-primary">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {md241 && (
        <Section title="Activity">
          <ol className="flex flex-col gap-2.5">
            {d.activity.map((e) => (
              <li key={e.time} className="flex items-center gap-3">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-gray-400" />
                <span className="text-xs font-medium text-quaternary">{e.time}</span>
                <span className="text-sm font-normal text-secondary">{e.text}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}

export function FlightDetail({
  flightId,
  onClose,
  acknowledged,
  onAcknowledge,
}: {
  flightId: string | null;
  onClose: () => void;
  acknowledged: Map<string, string>;
  onAcknowledge: (alertId: string) => void;
}) {
  const flight = FLIGHTS.find((f) => f.id === flightId) ?? null;
  const ref = useDialog(Boolean(flight), onClose);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!flight || isDesktop === null) return null;

  const md241 = flight.id === FLIGHT_DETAIL_MD241.flightId;
  const alert = ALERTS.find((a) => a.opensFlight === flight.id);
  const ackBy = alert ? alert.acknowledgedBy ?? acknowledged.get(alert.id) : undefined;
  const title = `${flight.id}${flight.illustrative ? " *" : ""} · ${flight.airline}`;
  const route = md241 ? FLIGHT_DETAIL_MD241.route : `${flight.from} → ${flight.to} · ${flight.direction}`;

  const actions = (layout: "desktop" | "mobile") => {
    const size = layout === "mobile" ? "lg" : "md";
    const grow = layout === "mobile" ? "flex-1" : undefined;
    return (
      <>
        <Button variant="secondary" size={size} className={grow} title="Notify gate agent (not designed in this case study)">
          {FLIGHT_DETAIL_MD241.actions.secondary}
        </Button>
        {alert && (
          <Button
            variant="primary"
            size={size}
            className={grow}
            disabled={Boolean(ackBy)}
            iconLeading={ackBy ? Check : undefined}
            onClick={() => onAcknowledge(alert.id)}
          >
            {ackBy ? "Acknowledged" : FLIGHT_DETAIL_MD241.actions.primary}
          </Button>
        )}
      </>
    );
  };

  const header = (layout: "desktop" | "mobile") => (
    <div className={cn("relative flex w-full items-start", layout === "mobile" ? "px-4" : "px-6")}>
      <div className="flex min-w-0 flex-1 items-start gap-4 pr-10 pt-6">
        <FeaturedIcon />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-primary">
          <h2 id="flight-detail-title" tabIndex={-1} data-autofocus className={cn("font-semibold outline-none", layout === "mobile" ? "text-lg" : "text-xl")}>
            {title}
          </h2>
          {layout === "mobile" && md241 ? (
            <p className="text-md font-normal">
              {FLIGHT_DETAIL_MD241.routeMobile[0]}
              <br />
              {FLIGHT_DETAIL_MD241.routeMobile[1]}
            </p>
          ) : (
            <p className="text-md font-normal">{route}</p>
          )}
        </div>
      </div>
      <IconButton icon={XClose} aria-label="Close flight details" onClick={onClose} className="absolute right-4 top-3" />
    </div>
  );

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="animate-fade-in absolute inset-0 bg-gray-950/25" onClick={onClose} aria-hidden="true" />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby="flight-detail-title"
          tabIndex={-1}
          className="animate-slide-in-right absolute right-0 top-0 flex h-full w-[480px] max-w-full flex-col border-l border-border-secondary bg-bg-primary shadow-xl outline-none"
        >
          {header("desktop")}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4">
            <DetailBody flight={flight} />
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border-secondary px-6 py-4">{actions("desktop")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="animate-fade-in absolute inset-0 bg-gray-950/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flight-detail-title"
        tabIndex={-1}
        className="animate-slide-up relative flex max-h-[calc(100dvh-16px)] w-full flex-col overflow-hidden rounded-t-2xl bg-bg-primary shadow-xl outline-none"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-9 rounded-[2px] bg-border-primary" />
        </div>
        {header("mobile")}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-3">
          <DetailBody flight={flight} />
        </div>
        <div className="flex items-center gap-3 border-t border-border-secondary px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">{actions("mobile")}</div>
      </div>
    </div>
  );
}
