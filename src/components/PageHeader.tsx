import { NOW } from "@/data/scenario";
import { FreshnessIndicator, cn } from "@/components/ui";

/*
 * Page header — component set 113:1712 (Breakpoint=Desktop/Mobile × State=Default/Scrolled).
 * Desktop (113:2464): white, px 32 · py 24; title Display xs/Semibold + date Text sm tertiary (gap 4);
 *   right: "● Flights live" + "Gates as of 10:00 · next 10:15" chips, 40 px divider, clock "10:05" (Display xs)
 *   over "Local time · GMT+3" (Text xs tertiary), right-aligned; gap 12.
 * Mobile (113:1693): page-grey background, px 16 · py 12 · gap 12; title row; date row (date left, "10:05 GMT+3" right);
 *   borderless freshness on one line (16 px apart).
 * Scrolled: 1 px border-secondary bottom line + shadow-sm; on mobile the title row hides (120 → 84 px).
 * The page puts this inside a sticky wrapper.
 */
export function PageHeader({ scrolled }: { scrolled: boolean }) {
  return (
    <div
      className={cn(
        "w-full bg-bg-secondary transition-shadow duration-150 lg:bg-bg-primary",
        scrolled ? "border-b border-border-secondary shadow-sm" : "border-b border-transparent",
      )}
    >
      {/* Desktop */}
      <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-8 py-6 lg:flex">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <h1 className="text-display-xs font-semibold text-primary">Operations overview</h1>
          <p className="text-sm font-normal text-tertiary">{NOW.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <FreshnessIndicator state="live" style="chip" />
          <FreshnessIndicator state="current" style="chip" />
          <div aria-hidden="true" className="h-10 w-px bg-border-secondary" />
          <div className="flex flex-col items-end whitespace-nowrap">
            <p className="text-display-xs font-semibold text-primary">
              <span className="sr-only">Local time </span>
              {NOW.time}
            </p>
            <p className="text-xs font-normal text-tertiary">Local time · {NOW.zone}</p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 px-4 py-3 lg:hidden">
        <div className="flex flex-col gap-1">
          <h1 className={cn("text-display-xs font-semibold text-primary", scrolled && "sr-only")}>Operations overview</h1>
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-normal text-tertiary">{NOW.date}</p>
            <p className="flex shrink-0 items-baseline gap-1 whitespace-nowrap">
              <span className="text-lg font-semibold text-primary">{NOW.time}</span>
              <span className="text-sm font-normal text-tertiary">{NOW.zone}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <FreshnessIndicator state="live" style="inline" />
          <FreshnessIndicator state="current" style="inline" />
        </div>
      </div>
    </div>
  );
}
