"use client";

import { useState } from "react";
import { SearchLg } from "@untitledui/icons";
import { FILTER_STATUSES, FLIGHTS } from "@/data/scenario";
import { ButtonGroup, CardHeader, CheckboxTag, SearchInput, buttonClasses, cn, iconStroke } from "@/components/ui";
import { FlightsTable } from "./FlightsTable";
import { FlightRow } from "./FlightRow";
import { useFlightFilters, type DirectionFilter, type SortBy, type FlightFilters } from "./useFlightFilters";

/*
 * Flights card 108:9293 (desktop) / Flights section 61:1505 (mobile).
 * Header "Flights" / "Next 2 hours · 12 flights" + search (320 px, bottom-aligned) → toolbar (direction tabs left,
 * sort right; pt 16 · px 24 · pb 12) → multi-select status checkbox tags (pt 8 · px 24 · pb 16) → table → footer.
 * Filtering, sorting and search really work (same rules on desktop and mobile).
 */
const TOTAL_TODAY = 186;

function directionItems(f: FlightFilters) {
  return [
    { value: "all" as DirectionFilter, label: "All", count: f.counts.all },
    { value: "dep" as DirectionFilter, label: "Departures", count: f.counts.dep },
    { value: "arr" as DirectionFilter, label: "Arrivals", count: f.counts.arr },
  ];
}
const SORT_ITEMS = [
  { value: "attention" as SortBy, label: "Needs attention" },
  { value: "time" as SortBy, label: "Time" },
];

function StatusChips({ f, className }: { f: FlightFilters; className?: string }) {
  return (
    <div role="group" aria-label="Filter by status" className={cn("flex items-center gap-2", className)}>
      {FILTER_STATUSES.map((s) => (
        <CheckboxTag key={s} label={s} count={f.counts.byStatus[s]} checked={f.statuses.has(s)} onChange={(on) => f.toggleStatus(s, on)} />
      ))}
      {f.statuses.size > 0 && (
        <button type="button" onClick={() => [...f.statuses].forEach((s) => f.toggleStatus(s, false))} className="ml-1 shrink-0 text-sm font-semibold text-tertiary hover:text-secondary">
          Clear
        </button>
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-sm font-semibold text-primary">No flights match</p>
      <p className="text-sm text-tertiary">
        Try another search or status.{" "}
        <button type="button" onClick={onClear} className="font-semibold text-brand-hover hover:underline">
          Clear filters
        </button>
      </p>
    </div>
  );
}

function ViewFullSchedule({ className }: { className?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      title="Flights page (not designed in this case study)"
      className={buttonClasses({ variant: "link-color", size: "md", className })}
    >
      View full schedule <span aria-hidden="true">→</span>
    </a>
  );
}

export function FlightsCard({ onOpenFlight, selectedFlightId }: { onOpenFlight: (id: string) => void; selectedFlightId?: string | null }) {
  const f = useFlightFilters();
  const [mobileSearch, setMobileSearch] = useState(false);
  const count = `Showing ${f.rows.length} of ${TOTAL_TODAY} flights today · * illustrative rows (assumption)`;

  return (
    <>
      {/* Desktop */}
      <section aria-labelledby="flights-title-desktop" className="hidden w-full flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary shadow-xs lg:flex">
        <CardHeader
          title="Flights"
          titleId="flights-title-desktop"
          helper={`Next 2 hours · ${FLIGHTS.length} flights`}
          rightAlign="end"
          right={<SearchInput value={f.query} onChange={f.setQuery} className="w-80" aria-label="Search flight, airline, city or gate" />}
        />
        <div className="flex items-center justify-between gap-3 px-6 pb-3 pt-4">
          <ButtonGroup aria-label="Direction" items={directionItems(f)} value={f.direction} onChange={f.setDirection} />
          <ButtonGroup aria-label="Sort by" items={SORT_ITEMS} value={f.sortBy} onChange={f.setSortBy} />
        </div>
        <StatusChips f={f} className="flex-wrap px-6 pb-4 pt-2" />
        <FlightsTable rows={f.rows} selectedFlightId={selectedFlightId} onOpenFlight={onOpenFlight} empty={<EmptyState onClear={f.clear} />} />
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <p className="text-sm font-normal text-tertiary">{count}</p>
          <ViewFullSchedule />
        </div>
      </section>

      {/* Mobile */}
      <section aria-labelledby="flights-title-mobile" className="w-full border-y border-border-secondary bg-bg-primary lg:hidden">
        <CardHeader title="Flights" titleId="flights-title-mobile" helper={`Next 2 hours · ${FLIGHTS.length} flights`} contentClassName="px-4 pt-4" />
        <div className="flex flex-col gap-3 px-4 pb-0.5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <ButtonGroup aria-label="Direction" items={directionItems(f)} value={f.direction} onChange={f.setDirection} />
            <button
              type="button"
              aria-label={mobileSearch ? "Close search" : "Search flights"}
              aria-expanded={mobileSearch}
              onClick={() => setMobileSearch((v) => !v)}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-md bg-bg-primary text-quaternary ring-1 ring-inset ring-border-primary",
                mobileSearch && "bg-bg-active",
              )}
            >
              <SearchLg size={20} strokeWidth={iconStroke(20)} />
            </button>
          </div>
          {mobileSearch && <SearchInput value={f.query} onChange={f.setQuery} aria-label="Search flight, airline, city or gate" />}
          <ButtonGroup aria-label="Sort by" items={SORT_ITEMS} value={f.sortBy} onChange={f.setSortBy} />
        </div>
        {/* Sideways-scrolling chips; 10 px above keeps a 44 px tap area on the 24 px tags */}
        <div className="no-scrollbar overflow-x-auto">
          <StatusChips f={f} className="w-max px-4 pb-4 pt-2.5" />
        </div>
        <ul className="border-t border-border-secondary">
          {f.rows.length === 0 ? (
            <li className="border-b border-border-secondary px-4 py-6">
              <EmptyState onClear={f.clear} />
            </li>
          ) : (
            f.rows.map((row) => <FlightRow key={row.id} f={row} selected={selectedFlightId === row.id} onOpen={() => onOpenFlight(row.id)} />)
          )}
        </ul>
        {/* Figma footer: pt 12 · gap 8 · pb 16; the link keeps a 44 px tap area without adding height (-my-3). */}
        <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
          <p className="text-sm font-normal text-tertiary">{count}</p>
          <ViewFullSchedule className="-my-3 min-h-11 self-start" />
        </div>
      </section>
    </>
  );
}
