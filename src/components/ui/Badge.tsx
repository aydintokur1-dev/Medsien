import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { iconStroke, type IconComponent } from "./icon";

export type BadgeColor = "gray" | "brand" | "error" | "warning" | "orange" | "success" | "blue" | "indigo";
export type BadgeSize = "sm" | "md";

/*
 * Untitled UI "Badge" (pill, 1 px inside stroke).
 * The stroke is drawn with an inset ring so it does not add to the size,
 * exactly like the Figma component (sm = 22 px tall, md = 24 px tall).
 */
const COLOR: Record<BadgeColor, { root: string; icon: string }> = {
  gray: { root: "bg-gray-50 ring-gray-200 text-gray-700", icon: "text-gray-500" },
  // utility-purple-200 (#d9d6fe) is not in the token set yet → falls back to brand-100.
  brand: {
    root: "bg-brand-50 ring-[color:var(--color-brand-200,var(--color-brand-100))] text-brand",
    icon: "text-brand",
  },
  error: { root: "bg-error-50 ring-error-200 text-error-700", icon: "text-error-500" },
  warning: { root: "bg-warning-50 ring-warning-200 text-warning-700", icon: "text-warning-500" },
  orange: { root: "bg-orange-50 ring-orange-200 text-orange-700", icon: "text-orange-500" },
  success: { root: "bg-success-50 ring-success-200 text-success-700", icon: "text-success-500" },
  blue: { root: "bg-blue-50 ring-blue-200 text-blue-700", icon: "text-blue-500" },
  indigo: { root: "bg-indigo-50 ring-indigo-200 text-indigo-700", icon: "text-indigo-500" },
};

const SIZE: Record<BadgeSize, { plain: string; withIcon: string; icon: number }> = {
  // sm: Text xs/Medium, px 8 · py 2; with icon: pl 6 · pr 8 · gap 2 · icon 12
  sm: { plain: "px-2 py-0.5 text-xs", withIcon: "gap-0.5 py-0.5 pl-1.5 pr-2 text-xs", icon: 12 },
  // md: Text sm/Medium, px 10 · py 2 (e.g. "6 to acknowledge")
  md: { plain: "px-2.5 py-0.5 text-sm", withIcon: "gap-1 py-0.5 pl-2 pr-2.5 text-sm", icon: 12 },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  /** Leading icon from `@untitledui/icons`. */
  icon?: IconComponent;
  /** Override the icon colour (defaults to the colour's 500 step). */
  iconClassName?: string;
  children: ReactNode;
}

export function Badge({ color = "gray", size = "sm", icon: Icon, iconClassName, className, children, ...rest }: BadgeProps) {
  const s = SIZE[size];
  const c = COLOR[color];
  return (
    <span
      className={cn(
        "inline-flex w-max shrink-0 items-center whitespace-nowrap rounded-full font-medium ring-1 ring-inset",
        Icon ? s.withIcon : s.plain,
        c.root,
        className,
      )}
      {...rest}
    >
      {Icon && (
        <Icon
          size={s.icon}
          strokeWidth={iconStroke(s.icon)}
          className={cn("shrink-0", iconClassName ?? c.icon)}
        />
      )}
      {children}
    </span>
  );
}
