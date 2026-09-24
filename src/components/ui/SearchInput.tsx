"use client";

import { SearchLg } from "@untitledui/icons";
import { cn } from "./cn";
import { iconStroke } from "./icon";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible name (there is no visible label in the design). */
  "aria-label"?: string;
  id?: string;
  /** Root width classes — full width when omitted; e.g. "w-80" for the 320 px desktop field. */
  className?: string;
}

/*
 * Search input 108:9297 — kit Input (sm) with leading search-lg icon, no label.
 * 36 px tall, white, 1 px border-primary (inside), radius-md 8, shadow-xs, px 12, gap 8,
 * icon 20 px text-quaternary, Text md (16/24) — placeholder text-quaternary.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search flight, airline, city or gate",
  className,
  id,
  ...rest
}: SearchInputProps) {
  return (
    <div className={cn("relative", className ?? "w-full")}>
      <SearchLg
        size={20}
        strokeWidth={iconStroke(20)}
        className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-quaternary"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={rest["aria-label"] ?? placeholder}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "h-9 w-full min-w-0 appearance-none truncate rounded-md bg-bg-primary pl-10 pr-3 text-md text-primary shadow-xs ring-1 ring-inset ring-border-primary",
          "placeholder:text-quaternary",
          "focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[color:var(--color-border-brand,var(--color-brand))]",
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
        )}
      />
    </div>
  );
}
