"use client";

import type { MouseEvent } from "react";
import { GATES, GATE_SUMMARY, type Gate, type GateState } from "@/data/scenario";
import { CardHeader, GateSwatch, buttonClasses, cn } from "@/components/ui";
import { PierTile } from "./PierTile";

export interface GatePanelProps {
  /** Mobile only: tapping a tile opens the gate sheet. */
  onGateTap: (gateId: string) => void;
  /** Gate whose sheet is open — shown with the Selected state. */
  selectedGate?: string | null;
}

const TITLE_ID = "gate-panel-title";
const PIERS: Gate["pier"][] = ["A", "B", "C"];

const STAT_DOT: Record<(typeof GATE_SUMMARY.stats)[number]["dot"], string> = {
  success: "bg-success-500",
  error: "bg-error-500",
  warning: "bg-warning-500",
};

/** Legend copy (not in the scenario data — it is UI copy from the Figma legend). */
const LEGEND: { state: GateState; label: string }[] = [
  { state: "occupied", label: "Occupied" },
  { state: "available", label: "Available" },
  { state: "out-of-service", label: "Out of service" },
  { state: "conflict-risk", label: "Conflict risk" },
];

/** Legend swatch (GateTile Size=sm). Conflict risk carries its 5 px dot at x 8.5 / y −0.5. */
function LegendSwatch({ state }: { state: GateState }) {
  return (
    <span aria-hidden="true" className="relative inline-flex shrink-0">
      <GateSwatch state={state} />
      {state === "conflict-risk" && (
        <span className="absolute left-[8.5px] top-[-0.5px] size-[5px] rounded-full bg-warning-600" />
      )}
    </span>
  );
}

/** Tailwind `lg` (64rem). Desktop clicks do nothing — the gate detail slide-out is not designed. */
function isDesktop() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 64rem)").matches;
}

/**
 * Gate availability card — Figma GatePanel 16:4722 (desktop instance 108:9426, mobile 70:3635).
 * Desktop (lg): 443 px card, 28 px tiles with hover / focus tooltips.
 * Mobile: edge-to-edge section, 24 px tiles with 3 px gaps, tap → onGateTap(id).
 */
export function GatePanel({ onGateTap, selectedGate = null }: GatePanelProps) {
  const handleTile = (gateId: string) => {
    if (isDesktop()) return;
    onGateTap(gateId);
  };

  const inertLink = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault();

  return (
    <section
      aria-labelledby={TITLE_ID}
      className="flex w-full flex-col border-y border-border-secondary bg-bg-primary lg:rounded-xl lg:border lg:shadow-xs"
    >
      <CardHeader
        title="Gate availability"
        titleId={TITLE_ID}
        divider
        rightAlign="start"
        className="lg:rounded-t-[11px]"
        contentClassName="max-lg:px-4"
        right={
          <span className="mt-[3px] whitespace-nowrap text-sm font-normal text-tertiary">
            {GATE_SUMMARY.total} gates
          </span>
        }
      />

      <div className="flex w-full flex-col gap-3 px-4 pb-5 pt-4 lg:px-5">
        <p className="text-sm font-semibold text-primary">{GATE_SUMMARY.inUseLabel}</p>

        {/* Progress bar — fill width as drawn in Figma (right inset 16.63 %). The label above carries the value. */}
        <div aria-hidden="true" className="relative h-2 w-full rounded-full bg-bg-quaternary">
          <div className="absolute inset-y-0 left-0 right-[16.63%] rounded-full bg-gray-700" />
        </div>

        <ul className="flex items-center gap-4">
          {GATE_SUMMARY.stats.map((stat) => (
            <li key={stat.label} className="flex shrink-0 items-center gap-1.5">
              <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", STAT_DOT[stat.dot])} />
              <span className="whitespace-nowrap text-xs font-medium text-tertiary">{stat.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-col gap-1.5 pt-1">
          {PIERS.map((pier) => (
            <div
              key={pier}
              role="group"
              aria-label={`Pier ${pier}`}
              className="flex items-center gap-0.5 min-[375px]:gap-[3px] lg:gap-1"
            >
              <span aria-hidden="true" className="h-[18px] w-4 shrink-0 text-xs font-semibold text-tertiary">
                {pier}
              </span>
              {GATES.filter((g) => g.pier === pier).map((gate) => (
                <PierTile
                  key={gate.id}
                  gate={gate}
                  selected={selectedGate === gate.id}
                  onClick={() => handleTile(gate.id)}
                />
              ))}
            </div>
          ))}
        </div>

        <ul aria-label="Legend" className="flex w-full flex-wrap items-center gap-x-3.5 gap-y-2 pt-1">
          {LEGEND.map((item) => (
            <li key={item.state} className="flex shrink-0 items-center gap-1.5">
              <LegendSwatch state={item.state} />
              <span className="whitespace-nowrap text-xs font-normal text-tertiary">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full items-center justify-between gap-4 border-t border-border-secondary px-4 py-3 lg:px-5">
        <p className="whitespace-nowrap text-xs font-normal text-tertiary">
          <span className="lg:hidden">Tap a gate for details</span>
          <span className="hidden lg:inline">Click a gate for details</span>
        </p>
        <a
          href="#"
          onClick={inertLink}
          className={buttonClasses({ variant: "link-color", size: "sm", className: "max-lg:-my-3 max-lg:min-h-11" })}
        >
          <span>
            Open gate timeline <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}

export default GatePanel;
