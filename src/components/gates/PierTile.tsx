import type { ButtonHTMLAttributes } from "react";
import type { Gate } from "@/data/scenario";
import { cn } from "@/components/ui";

/*
 * Gate tile as placed in the GatePanel pier rows (Figma 108:9426 / 70:3635).
 * The shared `GateTile` primitive is fixed at 30 px; the panel instances are resized to
 * 28 px (desktop, gap 4) and 24 px (mobile, gap 3), and the conflict dot keeps its
 * left/top constraint (19.5 / 1.5 px from the tile's outer edge), so on the 24 px tile it
 * hangs over the corner. Fills, outlines, hover, focus ring and tooltip mirror the primitive
 * (GateTile 12:82 + hover/focus spec 44:3903).
 */

type TileVisual = Gate["state"] | "selected";

const TILE: Record<TileVisual, { tile: string; text: string }> = {
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
  // border-brand in the kit is #6d40e0 — picks up --color-border-brand once it exists, else brand.
  selected: {
    tile: "border-2 border-[color:var(--color-border-brand,var(--color-brand))] bg-bg-tertiary hover:bg-gray-200",
    text: "font-semibold text-primary",
  },
};

export interface PierTileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  gate: Gate;
  selected?: boolean;
}

export function PierTile({ gate, selected = false, className, type = "button", ...rest }: PierTileProps) {
  const visual: TileVisual = selected ? "selected" : gate.state;
  const s = TILE[visual];
  // Figma note on 44:3903: the tooltip text is also the tile's accessible name.
  const accessibleName = [gate.tooltipTitle, ...gate.tooltipLines].join(". ");

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type={type}
        aria-label={accessibleName}
        className={cn(
          "peer relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm lg:size-7",
          "focus-visible:z-10 focus-visible:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary focus-visible:ring-[color:var(--color-border-brand,var(--color-brand))]",
          s.tile,
          className,
        )}
        {...rest}
      >
        {visual === "out-of-service" && (
          // Hatch: 1 px error-200 "\" diagonals, 5 px apart horizontally, filling the inside of the outline.
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[4.5px] bg-[repeating-linear-gradient(45deg,var(--color-error-200)_0_1px,transparent_1px_3.5355px)]"
          />
        )}
        <span aria-hidden="true" className={cn("relative whitespace-nowrap text-xs", s.text)}>
          {gate.number}
        </span>
        {visual === "conflict-risk" && (
          // 6 px warning-600 dot at x 19.5 / y 1.5 from the outer edge (inside the 1.5 px outline: 18 / 0).
          <span aria-hidden="true" className="absolute left-[18px] top-0 size-1.5 rounded-full bg-warning-600" />
        )}
      </button>

      {/* Desktop-only tooltip (display:none below lg — mobile taps open the gate sheet instead). */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none invisible absolute bottom-9 z-30 hidden flex-col items-start gap-0.5 rounded-md bg-gray-950 px-3 py-2 opacity-0 shadow-lg lg:flex",
          "transition-[opacity,visibility] duration-100",
          "peer-hover:visible peer-hover:opacity-100 peer-hover:delay-300",
          "peer-focus-visible:visible peer-focus-visible:opacity-100 peer-focus-visible:delay-0",
          gate.opensLeft ? "right-0" : "left-0",
        )}
      >
        <span className="whitespace-nowrap text-xs font-semibold text-white">{gate.tooltipTitle}</span>
        {gate.tooltipLines.map((line, i) => (
          <span key={i} className="whitespace-nowrap text-xs font-normal text-gray-300">
            {line}
          </span>
        ))}
        {/* 12 × 6 arrow centred on the 28 px tile (8 px in from the anchored edge). */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-[5px] h-1.5 w-3 bg-gray-950 [clip-path:polygon(0_0,100%_0,50%_100%)]",
            gate.opensLeft ? "right-2" : "left-2",
          )}
        />
      </span>
    </span>
  );
}
