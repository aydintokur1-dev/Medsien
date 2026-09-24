import type { ReactNode } from "react";
import { cn } from "./cn";

export interface CardHeaderProps {
  title: string;
  /** Helper / supporting text under the title (truncates on one line). */
  helper?: string;
  /** Right slot: a badge, a count, a search field… */
  right?: ReactNode;
  /** Vertical alignment of the right slot against the title block (Alerts badge = center, Flights search = end). */
  rightAlign?: "start" | "center" | "end";
  /** 1 px border-secondary line under the header (kit default; Alerts & Gates cards). */
  divider?: boolean;
  /** Heading level for the title. */
  as?: "h2" | "h3";
  /** id for the title, e.g. to label the card section with aria-labelledby. */
  titleId?: string;
  className?: string;
  /** Padding override for the content row (default pt 20 · px 24), e.g. "px-4 pt-4" on mobile. */
  contentClassName?: string;
}

const ALIGN = { start: "self-start", center: "self-center", end: "self-end" } as const;

/*
 * Kit Card header as used on the Flights / Alerts / Gates cards:
 * content pt 20 · px 24 · gap 16; title Text lg/Semibold text-primary, helper Text sm/Regular
 * text-tertiary (gap 2); optional divider 20 px below the content.
 */
export function CardHeader({
  title,
  helper,
  right,
  rightAlign = "center",
  divider = false,
  as: Heading = "h2",
  titleId,
  className,
  contentClassName,
}: CardHeaderProps) {
  return (
    <div className={cn("flex w-full flex-col gap-5 bg-bg-primary", className)}>
      <div className={cn("flex w-full items-start gap-4 px-6 pt-5", contentClassName)}>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <Heading id={titleId} className="text-lg font-semibold text-primary">
            {title}
          </Heading>
          {helper && <p className="truncate text-sm font-normal text-tertiary">{helper}</p>}
        </div>
        {right && <div className={cn("flex shrink-0 items-center", ALIGN[rightAlign])}>{right}</div>}
      </div>
      {divider && <div aria-hidden="true" className="h-px w-full bg-border-secondary" />}
    </div>
  );
}
