"use client";

import { cn } from "./cn";

export interface ButtonGroupItem<T extends string = string> {
  value: T;
  label: string;
  /** Shown after the label in the same style, e.g. "All 12". */
  count?: number;
}

export interface ButtonGroupProps<T extends string = string> {
  items: ButtonGroupItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group, e.g. "Direction" or "Sort by". */
  "aria-label": string;
  /** Stretch items to fill the width (mobile). */
  fullWidth?: boolean;
  className?: string;
  itemClassName?: string;
}

/*
 * Segmented control — kit Button group as used for Direction tabs 108:9299 and Sort 108:9301.
 * No shadow. 1 px border-primary outline (inside, so the control stays 40 px tall), radius-md 8,
 * items min-h 40 · px 16 · py 8 · Text sm/Semibold text-secondary, 1 px border-primary divider on
 * the right of each item; the selected item uses bg-active.
 */
export function ButtonGroup<T extends string>({
  items,
  value,
  onChange,
  fullWidth = false,
  className,
  itemClassName,
  ...rest
}: ButtonGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={rest["aria-label"]}
      className={cn(
        "relative isolate overflow-hidden rounded-md",
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-md after:ring-1 after:ring-inset after:ring-border-primary",
        fullWidth ? "flex w-full" : "inline-flex w-max max-w-full",
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(item.value)}
            className={cn(
              "flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-semibold text-secondary",
              "shadow-[inset_-1px_0_0_0_var(--color-border-primary)] transition-colors duration-100",
              "focus-visible:z-20 focus-visible:-outline-offset-2",
              selected ? "bg-bg-active" : "bg-bg-primary hover:bg-bg-secondary",
              fullWidth && "flex-1",
              itemClassName,
            )}
          >
            {item.count === undefined ? item.label : `${item.label} ${item.count}`}
          </button>
        );
      })}
    </div>
  );
}
