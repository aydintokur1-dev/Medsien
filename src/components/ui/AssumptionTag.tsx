import { Badge } from "./Badge";

export interface AssumptionTagProps {
  /** sm = "Assumption" · xs = "A" (tight table cells). */
  size?: "sm" | "xs";
  className?: string;
}

/** Figma AssumptionTag 11:3399 — marks any value not given in the brief. */
export function AssumptionTag({ size = "sm", className }: AssumptionTagProps) {
  return (
    <Badge color="brand" className={className} title="Assumption — not given in the brief">
      {size === "xs" ? (
        <>
          <span aria-hidden="true">A</span>
          <span className="sr-only">Assumption</span>
        </>
      ) : (
        "Assumption"
      )}
    </Badge>
  );
}
