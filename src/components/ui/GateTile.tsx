import type { ButtonHTMLAttributes } from "react";
import type { GateState } from "@/data/scenario";
import { cn } from "./cn";

export type GateTileState = GateState | "selected";
export type GateTileSize = "sm" | "md";

export interface GateTooltip {
  title: string;
  lines: string[];
  /** Open towards the left (columns 4+) so the tooltip never leaves the card. */
  opensLeft?: boolean;
}

export interface GateTileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  state: GateTileState;
  /** Text inside the tile, e.g. "06" (desktop pier rows) or "B06". */
  label: string;
  size?: GateTileSize;
  /** Persistent brand outline while the gate's detail is open (Figma State=Selected). */
  selected?: boolean;
  /** Dark tooltip on hover (after 300 ms) and keyboard focus. Its text is also the tile's accessible name. */
  tooltip?: GateTooltip;
  /** Class for the positioning wrapper (the tile itself is fixed at 30 × 30). */
  wrapperClassName?: string;
}

/*
 * Figma GateTile 12:82 + hover/focus spec 44:3903.
 * Hover = fill one step darker, outline untouched (occupied: border-secondary → border-primary).
 * Focus = kit focus ring (2 px white gap + 2 px brand ring + shadow-xs).
 */
const TILE: Record<GateTileState, { tile: string; text: string }> = {
  occupied: {
    tile: "border border-border-secondary bg-bg-tertiary hover:border-border-primary hover:bg-gray-200",
    text: "font-medium text-tertiary",
  },
  available: {
    tile: "border-[1.5px] border-success-600 bg-bg-primary hover:bg-success-50",
    text: "font-semibold text-success-700",
  },
  "out-of-service": {
    tile: "border-[1.5px] border-error-500 bg-error-50 hover:bg-error-100",
    text: "font-semibold text-error-700",
  },
  "conflict-risk": {
    tile: "border-[1.5px] border-dashed border-warning-600 bg-bg-tertiary hover:bg-gray-200",
    text: "font-medium text-tertiary",
  },
  // border-brand in the kit is #6d40e0 — uses --color-border-brand when the lead adds it, else brand.
  selected: {
    tile: "border-2 border-[color:var(--color-border-brand,var(--color-brand))] bg-bg-tertiary hover:bg-gray-200",
    text: "font-semibold text-primary",
  },
};

/** Legend swatches (Size=sm, 16 × 16): same fills and outlines, no text, no hover. */
const SWATCH: Record<GateTileState, string> = {
  occupied: "border border-border-secondary bg-bg-tertiary",
  available: "border-[1.5px] border-success-600 bg-bg-primary",
  "out-of-service": "border-[1.5px] border-error-500 bg-error-50",
  "conflict-risk": "border-[1.5px] border-dashed border-warning-600 bg-bg-tertiary",
  selected: "border-2 border-[color:var(--color-border-brand,var(--color-brand))] bg-bg-tertiary",
};

/** Out-of-service hatch: 1 px error-200 diagonals every 5 px (horizontal pitch), clipped to the tile. */
function Hatch({ radius }: { radius: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-[0.5px] bg-[repeating-linear-gradient(45deg,var(--color-error-200)_0_1px,transparent_1px_3.5355px)]",
        radius,
      )}
    />
  );
}

/** Tiny legend swatch (GateTile Size=sm). Decorative — pair it with a text label. */
export function GateSwatch({ state, className }: { state: GateTileState; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative inline-block size-4 shrink-0 rounded-xs", SWATCH[state], className)}>
      {state === "out-of-service" && <Hatch radius="rounded-[2px]" />}
    </span>
  );
}

export function GateTile({
  state,
  label,
  size = "md",
  selected = false,
  tooltip,
  wrapperClassName,
  className,
  type = "button",
  ...rest
}: GateTileProps) {
  if (size === "sm") return <GateSwatch state={selected ? "selected" : state} className={className} />;

  const visual: GateTileState = selected ? "selected" : state;
  const s = TILE[visual];
  // "The same text is the tile's accessible name" (Figma note on 44:3903).
  const accessibleName = tooltip ? [tooltip.title, ...tooltip.lines].join(". ") : label;

  return (
    <span className={cn("relative inline-flex shrink-0", wrapperClassName)}>
      <button
        type={type}
        className={cn(
          "peer relative flex size-[30px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm",
          "focus-visible:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:ring-[color:var(--color-border-brand,var(--color-brand))]",
          s.tile,
          className,
        )}
        aria-label={accessibleName}
        {...rest}
      >
        {visual === "out-of-service" && <Hatch radius="rounded-[4px]" />}
        <span className={cn("relative whitespace-nowrap text-xs", s.text)}>{label}</span>
        {visual === "conflict-risk" && (
          <span aria-hidden="true" className="absolute right-[1.5px] top-[1.5px] size-1.5 rounded-full bg-warning-600" />
        )}
      </button>

      {tooltip && (
        <span
          aria-hidden="true"
          className={cn(
            // Desktop only (display:none below lg so the hidden tooltip can never widen the mobile page).
            "pointer-events-none invisible absolute bottom-[38px] z-30 hidden flex-col items-start gap-0.5 rounded-md bg-gray-950 px-3 py-2 opacity-0 shadow-lg lg:flex",
            "transition-[opacity,visibility] duration-100",
            "peer-hover:visible peer-hover:opacity-100 peer-hover:delay-300",
            "peer-focus-visible:visible peer-focus-visible:opacity-100 peer-focus-visible:delay-0",
            tooltip.opensLeft ? "right-0" : "left-0",
          )}
        >
          <span className="whitespace-nowrap text-xs font-semibold text-white">{tooltip.title}</span>
          {tooltip.lines.map((line, i) => (
            <span key={i} className="whitespace-nowrap text-xs font-normal text-gray-300">
              {line}
            </span>
          ))}
          {/* 12 × 6 arrow, 9 px in from the anchored edge, overlapping the body by 1 px */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -bottom-[5px] h-1.5 w-3 bg-gray-950 [clip-path:polygon(0_0,100%_0,50%_100%)]",
              tooltip.opensLeft ? "right-[9px]" : "left-[9px]",
            )}
          />
        </span>
      )}
    </span>
  );
}
