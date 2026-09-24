"use client";

import { useMemo, useState } from "react";
import { FILTER_STATUSES, FLIGHTS, type Flight, type FilterStatus } from "@/data/scenario";

export type DirectionFilter = "all" | "dep" | "arr";
export type SortBy = "attention" | "time";

/** Shared filter state for the desktop table and the mobile list (same rules, same counts). */
export function useFlightFilters() {
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("attention");
  const [statuses, setStatuses] = useState<Set<FilterStatus>>(new Set());
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const byStatus = Object.fromEntries(FILTER_STATUSES.map((s) => [s, FLIGHTS.filter((f) => f.filterStatus === s).length])) as Record<FilterStatus, number>;
    return {
      all: FLIGHTS.length,
      dep: FLIGHTS.filter((f) => f.direction === "Departure").length,
      arr: FLIGHTS.filter((f) => f.direction === "Arrival").length,
      byStatus,
    };
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = (f: Flight) =>
      !q ||
      [f.id, f.airline, f.from, f.to, f.gate, f.gateNote ?? ""].some((v) => v.toLowerCase().includes(q));
    const list = FLIGHTS.filter(
      (f) =>
        (direction === "all" || (direction === "dep" ? f.direction === "Departure" : f.direction === "Arrival")) &&
        (statuses.size === 0 || statuses.has(f.filterStatus)) &&
        matches(f),
    );
    return [...list].sort((a, b) => (sortBy === "attention" ? a.attentionRank - b.attentionRank : a.sched.localeCompare(b.sched)));
  }, [direction, sortBy, statuses, query]);

  const toggleStatus = (s: FilterStatus, on: boolean) =>
    setStatuses((prev) => {
      const next = new Set(prev);
      if (on) next.add(s);
      else next.delete(s);
      return next;
    });

  const clear = () => {
    setDirection("all");
    setStatuses(new Set());
    setQuery("");
  };

  return { direction, setDirection, sortBy, setSortBy, statuses, toggleStatus, query, setQuery, counts, rows, clear };
}

export type FlightFilters = ReturnType<typeof useFlightFilters>;
