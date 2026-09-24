import type { ThHTMLAttributes } from "react";
import { cn } from "./cn";

/*
 * Kit Table header cell 108:9311: 44 px, bg-secondary, 1 px border-secondary bottom, px 16 (first column
 * pl 24 · pr 16 — pass className), Text xs/Semibold text-quaternary.
 */
export function TableHeaderCell({ className, scope = "col", children, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope={scope}
      className={cn(
        "h-11 whitespace-nowrap border-b border-border-secondary bg-bg-secondary px-4 py-3 text-left align-middle text-xs font-semibold text-quaternary",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}
