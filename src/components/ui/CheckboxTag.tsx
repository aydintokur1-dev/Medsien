"use client";

import { Check } from "@untitledui/icons";
import { cn } from "./cn";

export interface CheckboxTagProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
  className?: string;
  disabled?: boolean;
}

/*
 * Filter chip — kit Tag (size md) with Checkbox=True and a count, as in Status filters 108:9304.
 * White, 1 px border-primary (inside), radius-sm 6, pl 4 · pr 3 · py 2, gap 5.
 * Checkbox 16 px radius-xs: unchecked = white + border-primary; checked = brand solid + white check.
 * Label Text sm/Medium text-secondary; count = bg-tertiary, radius 3, px 5, Text xs/Medium.
 */
export function CheckboxTag({ label, checked, onChange, count, className, disabled }: CheckboxTagProps) {
  return (
    <label
      className={cn(
        "relative inline-flex w-max shrink-0 cursor-pointer select-none items-center gap-[5px] rounded-sm bg-bg-primary py-0.5 pl-1 pr-[3px] ring-1 ring-inset ring-border-primary",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-xs ring-1 ring-inset transition-colors duration-100",
          checked ? "bg-bg-brand-solid ring-bg-brand-solid text-on-brand" : "bg-bg-primary ring-border-primary",
        )}
      >
        {checked && <Check size={12} strokeWidth={3.5} className="size-3" />}
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-secondary">{label}</span>
      {count !== undefined && (
        <span className="flex min-w-[19px] items-center justify-center rounded-[3px] bg-bg-tertiary px-[5px] text-xs font-medium text-secondary">
          {count}
        </span>
      )}
    </label>
  );
}
