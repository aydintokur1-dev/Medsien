"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALERTS, KPIS, NOW } from "@/data/scenario";
import { AppHeader } from "./AppHeader";
import { PageHeader } from "./PageHeader";
import { KpiStrip } from "./KpiStrip";
import { FlightsCard } from "./flights/FlightsCard";
import { AlertsCard } from "./alerts/AlertsCard";
import { GatePanel } from "./gates/GatePanel";
import { FlightDetail } from "./detail/FlightDetail";
import { GateSheet } from "./detail/GateSheet";
import { Toast } from "./Toast";

/*
 * Page assembly. DOM order = priority order: Active alerts, Flights, Gate availability.
 * Desktop ≥ 1400 px = the 1440 design: Flights card left, right column 443 px (alerts 558 px + gates).
 * 1024–1399 px (tablet landscape, small laptops): the three cards stack full width in priority order, alerts first.
 * < 1024 px = the 375 mobile design: KPI strip, Active alerts, Flights, Gate availability (full-bleed sections).
 * The flight detail is deep-linkable: ?flight=MD241.
 */
const ME = "SK";

export function Dashboard() {
  const [flightId, setFlightId] = useState<string | null>(null);
  const [gateId, setGateId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState<Map<string, string>>(new Map());
  const [toast, setToastState] = useState<{ id: number; message: string; undoId?: string; tone?: "success" | "info" } | null>(null);
  const toastSeq = useRef(0);
  const setToast = useCallback((t: { message: string; undoId?: string; tone?: "success" | "info" } | null) => {
    setToastState(t ? { ...t, id: ++toastSeq.current } : null);
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // Deep link: ?flight=MD241 opens the panel on load; the URL follows the open panel.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("flight");
    // Read after hydration on purpose: the server can't see the URL, so doing it in render would mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) setFlightId(id.toUpperCase());
  }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (flightId) url.searchParams.set("flight", flightId);
    else url.searchParams.delete("flight");
    window.history.replaceState(null, "", url);
  }, [flightId]);

  // Sticky page header: "Scrolled" once content moves under it.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const acknowledge = useCallback((alertId: string) => {
    setAcknowledged((prev) => new Map(prev).set(alertId, `${ME} ${NOW.time}`));
    const a = ALERTS.find((x) => x.id === alertId);
    setToast({ message: `Alert acknowledged${a ? ` · ${a.title.replace(/ \*$/, "")}` : ""}`, undoId: alertId });
  }, [setToast]);
  const undoId = toast?.undoId;
  const undo = useCallback(() => {
    if (undoId) {
      setAcknowledged((prev) => {
        const next = new Map(prev);
        next.delete(undoId);
        return next;
      });
    }
    setToast(null);
  }, [undoId, setToast]);
  const dismissToast = useCallback(() => setToast(null), [setToast]);

  const viewAlert = useCallback((alertId: string) => {
    const a = ALERTS.find((x) => x.id === alertId);
    if (a?.opensFlight) {
      setFlightId(a.opensFlight);
      return;
    }
    // Other linked objects (gates, checkpoints) have no designed detail yet.
    setToast({ message: "Detail for this alert is not designed in this case study", tone: "info" });
  }, [setToast]);

  // KPI cards lead to full-day views (Alerts / Flights / Gates pages), which the case study does not design.
  const openKpi = useCallback((kpiId: string) => {
    const k = KPIS.find((x) => x.id === kpiId);
    if (k) setToast({ message: `Opens ${k.opens} — not designed in this case study`, tone: "info" });
  }, [setToast]);

  const closeFlight = useCallback(() => setFlightId(null), []);
  const closeGate = useCallback(() => setGateId(null), []);

  return (
    <div className="min-h-dvh bg-bg-secondary lg:bg-bg-primary">
      <AppHeader />
      {/* Mobile: 16 px between the nav bar and the page header (scrolls away; the header then sticks at the top). */}
      <div aria-hidden="true" className="h-4 lg:hidden" />
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <div className="sticky top-0 z-30 -mt-px">
        <PageHeader scrolled={scrolled} />
      </div>

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:px-8 lg:pt-0">
        <KpiStrip onOpen={openKpi} />
        <div className="grid grid-cols-1 items-start gap-4 lg:gap-6 wide:grid-cols-[minmax(0,1fr)_443px]">
          <div className="min-w-0 wide:col-start-2 wide:row-start-1">
            <AlertsCard acknowledged={acknowledged} onAcknowledge={acknowledge} onView={viewAlert} />
          </div>
          <div className="min-w-0 wide:col-start-1 wide:row-span-2 wide:row-start-1">
            <FlightsCard onOpenFlight={setFlightId} selectedFlightId={flightId} />
          </div>
          <div className="min-w-0 wide:col-start-2 wide:row-start-2">
            <GatePanel onGateTap={setGateId} selectedGate={gateId} />
          </div>
        </div>
      </main>

      <footer className="px-4 pb-8 text-center text-xs text-quaternary">
        Case study prototype · fictional data · designed and built for a UI/UX take-home, not a real airport system.
      </footer>

      <FlightDetail flightId={flightId} onClose={closeFlight} acknowledged={acknowledged} onAcknowledge={acknowledge} />
      <GateSheet
        gateId={gateId}
        onClose={closeGate}
        onViewFlight={(id) => {
          setGateId(null);
          setFlightId(id);
        }}
      />
      <Toast message={toast?.message ?? null} id={toast?.id} tone={toast?.tone} onUndo={toast?.undoId ? undo : undefined} onDismiss={dismissToast} />
    </div>
  );
}
