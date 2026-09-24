"use client";

import type { Flight } from "@/data/scenario";
import { SeverityBadge, StatusBadge, TableHeaderCell, cn } from "@/components/ui";

/*
 * Flights table 108:9309 — columns 172 / flexible / 84 / 84 / 156 / 128 / 116, header 44 px, rows 56 px.
 * Cells: 1 px border-secondary bottom, px 16 (first column pl 24), Text sm (14/20).
 * The WHOLE row reacts to hover (bg-secondary on every cell at once) and opens the flight detail.
 */
const COLS = ["w-[172px]", "", "w-[84px]", "w-[84px]", "w-[156px]", "w-[128px]", "w-[116px]"];

const EST_TONE: Record<Flight["estTone"], string> = {
  same: "font-normal text-tertiary",
  "delayed-long": "font-medium text-orange-700",
  delayed: "font-medium text-warning-700",
  early: "font-medium text-primary",
  none: "font-normal text-quaternary",
};

export function FlightsTable({
  rows,
  selectedFlightId,
  onOpenFlight,
  empty,
}: {
  rows: Flight[];
  selectedFlightId?: string | null;
  onOpenFlight: (id: string) => void;
  empty: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] table-fixed border-collapse text-left">
        <colgroup>
          {COLS.map((c, i) => (
            <col key={i} className={c} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <TableHeaderCell className="pl-6">Flight</TableHeaderCell>
            <TableHeaderCell>Route</TableHeaderCell>
            <TableHeaderCell>Sched</TableHeaderCell>
            <TableHeaderCell>Est</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Gate</TableHeaderCell>
            <TableHeaderCell>Alert</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="border-b border-border-secondary px-6 py-8">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((f) => <Row key={f.id} f={f} selected={selectedFlightId === f.id} onOpen={() => onOpenFlight(f.id)} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

function Row({ f, selected, onOpen }: { f: Flight; selected: boolean; onOpen: () => void }) {
  const cancelled = f.status.kind === "cancelled";
  const td = "h-14 border-b border-border-secondary px-4 align-middle text-sm whitespace-nowrap";
  return (
    <tr
      tabIndex={0}
      role="button"
      aria-label={`${f.id}${f.illustrative ? " (illustrative)" : ""}, ${f.airline} ${f.direction.toLowerCase()}, ${f.from} to ${f.to}, ${f.status.label}, gate ${f.gate}. Open details`}
      aria-pressed={selected}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "cursor-pointer transition-colors duration-100 focus-visible:-outline-offset-2",
        selected ? "bg-bg-secondary" : "bg-bg-primary hover:bg-bg-secondary",
      )}
    >
      <td className={cn(td, "pl-6")}>
        <div className={cn("flex flex-col", cancelled ? "text-quaternary" : "")}>
          <span className={cn("font-medium", cancelled ? "" : "text-primary")}>
            {f.id}
            {f.illustrative && " *"}
          </span>
          <span className={cn("font-normal", cancelled ? "" : "text-tertiary")}>
            {f.airline} · {f.direction}
          </span>
        </div>
      </td>
      {/* No right padding: at 1440 the 167 px column is only wide enough for "Istanbul → Amsterdam" this way (as in Figma). */}
      <td className={cn(td, "truncate pr-0", cancelled ? "text-quaternary" : "text-secondary")}>
        {f.from} → {f.to}
      </td>
      <td className={cn(td, cancelled ? "text-quaternary line-through" : "text-tertiary")}>{f.sched}</td>
      <td className={cn(td, EST_TONE[f.estTone])}>{f.est ?? "—"}</td>
      <td className={td}>
        <StatusBadge kind={f.status.kind} label={f.status.label} />
      </td>
      <td className={td}>
        {f.gateNote ? (
          <div className="flex flex-col">
            <span className="font-medium text-primary">{f.gate}</span>
            <span className="font-normal text-warning-700">{f.gateNote}</span>
          </div>
        ) : (
          <span className={cn("font-normal", cancelled ? "text-quaternary" : "text-primary")}>{f.gate}</span>
        )}
      </td>
      <td className={td}>
        {f.alert ? <SeverityBadge severity={f.alert} /> : <span className="text-quaternary">—</span>}
      </td>
    </tr>
  );
}
