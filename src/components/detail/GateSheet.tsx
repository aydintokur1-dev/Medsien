"use client";

import { XClose } from "@untitledui/icons";
import { GATES, GATE_SHEET_B06 } from "@/data/scenario";
import { Button, FreshnessIndicator, IconButton } from "@/components/ui";
import { useDialog } from "./useDialog";

/*
 * Mobile gate sheet 66:3386 — tap replaces hover: same content as the desktop tooltip.
 * White, rounded-2xl top, shadow-xl; grabber (36×4, border-primary); header px 16 · pt 24: title Text lg/Semibold,
 * subtitle Text sm tertiary; × at top 12 · right 16. Body p 16 · gap 12: "Now" / "Next" rows (40 px label column,
 * Text sm/Medium), divider, inline freshness. Footer border-t, px 16 · pt 12 · pb 16: two equal secondary buttons (lg).
 */
export function GateSheet({
  gateId,
  onClose,
  onViewFlight,
}: {
  gateId: string | null;
  onClose: () => void;
  onViewFlight: (flightId: string) => void;
}) {
  const gate = GATES.find((g) => g.id === gateId) ?? null;
  const ref = useDialog(Boolean(gate), onClose);
  if (!gate) return null;

  const b06 = gate.id === GATE_SHEET_B06.gate;
  const lines = gate.tooltipLines.filter((l) => !l.startsWith("Gate data as of"));
  const now = lines.find((l) => l.startsWith("Now:"));
  const next = lines.find((l) => l.startsWith("Next:"));
  const other = lines.filter((l) => l !== now && l !== next);

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden">
      <div className="animate-fade-in absolute inset-0 bg-gray-950/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-sheet-title"
        tabIndex={-1}
        className="animate-slide-up relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-bg-primary shadow-xl outline-none"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-9 rounded-[2px] bg-border-primary" />
        </div>
        <div className="relative flex w-full items-start px-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-10 pt-6">
            <h2 id="gate-sheet-title" tabIndex={-1} data-autofocus className="text-lg font-semibold text-primary outline-none">
              {b06 ? GATE_SHEET_B06.title : gate.tooltipTitle}
            </h2>
            <p className="text-sm font-normal text-tertiary">{b06 ? GATE_SHEET_B06.subtitle : `Pier ${gate.pier}`}</p>
          </div>
          <IconButton icon={XClose} aria-label="Close gate details" onClick={onClose} className="absolute right-4 top-3" />
        </div>

        <div className="flex w-full flex-col gap-3 p-4">
          {b06 ? (
            <>
              <Row label="Now">{GATE_SHEET_B06.now}</Row>
              <Row label="Next">
                {GATE_SHEET_B06.next[0]}
                <br />
                <span className="text-warning-700">{GATE_SHEET_B06.next[1]}</span>
              </Row>
            </>
          ) : (
            <>
              {now && <Row label="Now">{now.replace(/^Now:\s*/, "")}</Row>}
              {next && <Row label="Next">{next.replace(/^Next:\s*/, "")}</Row>}
              {other.map((l) => (
                <p key={l} className="text-sm font-medium text-primary">
                  {l}
                </p>
              ))}
            </>
          )}
          <div className="h-px w-full bg-border-secondary" aria-hidden="true" />
          <FreshnessIndicator state="current" style="inline" />
        </div>

        <div className="flex items-center gap-3 border-t border-border-secondary px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
          {b06 && (
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => onViewFlight("MD241")}>
              {GATE_SHEET_B06.actions.secondary}
            </Button>
          )}
          <Button variant="secondary" size="lg" className="flex-1" title="Gate timeline (not designed in this case study)">
            {GATE_SHEET_B06.actions.primary}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full items-start gap-3 text-sm font-medium">
      <span className="w-10 shrink-0 text-tertiary">{label}</span>
      <span className="min-w-0 flex-1 text-primary">{children}</span>
    </div>
  );
}
