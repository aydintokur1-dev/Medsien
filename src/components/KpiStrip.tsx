import { KPIS } from "@/data/scenario";
import { KpiCard } from "@/components/ui";

/*
 * KPI strip.
 *
 * Desktop 108:9284: one row of 7 equal cards (flex 1 · min-w 0), gap 16. The Figma frame
 * has a white fill (it shows only in the 16 px gaps). The strip has no side padding of its
 * own; on the page it sits inside the Main area's 32 px padding.
 *
 * Mobile 56:1259 (in 181:4698): a full-bleed row that scrolls sideways. It has px 16 and gap 12,
 * and every card is 152 px wide and stretched to the tallest one (136 px), so supporting lines
 * wrap as in the design. The next card peeking in is the scroll cue, and the scrollbar is hidden.
 * "Flights today" uses the short mobile line ("94 dep · 92 arr").
 */
export function KpiStrip({ onOpen }: { onOpen: (kpiId: string) => void }) {
  return (
    <section aria-label="Key metrics" className="w-full min-w-0">
      {/* Mobile (< lg). py-1 / -my-1 keeps the cards' focus ring from being clipped by the scroller.
          The cards are links, so keyboard users reach (and scroll to) every card without an extra tab stop. */}
      <div
        role="region"
        aria-label="Key metrics, scroll sideways for more"
        className="no-scrollbar -my-1 snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain py-1 lg:hidden"
      >
        <ul className="flex w-max gap-3 px-4">
          {KPIS.map((kpi) => (
            <li key={kpi.id} className="flex w-[152px] shrink-0 snap-start">
              <KpiCard label={kpi.label} value={kpi.value} line={kpi.mobileLine ?? kpi.line} tone={kpi.tone} onClick={() => onOpen(kpi.id)} />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop (lg+) */}
      <ul className="hidden w-full gap-4 bg-bg-primary lg:flex">
        {KPIS.map((kpi) => (
          <li key={kpi.id} className="flex min-w-0 flex-1">
            <KpiCard label={kpi.label} value={kpi.value} line={kpi.line} tone={kpi.tone} onClick={() => onOpen(kpi.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
