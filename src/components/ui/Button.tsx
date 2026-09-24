import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { iconStroke, type IconComponent } from "./icon";

export type ButtonVariant = "primary" | "secondary" | "link-color" | "link-gray";
export type ButtonSize = "sm" | "md" | "lg";

/*
 * Untitled UI kit buttons (Text sm/Semibold · lg = Text md/Semibold, radius-md 8 px, 20 px icons).
 * Solid buttons: sm 36 px · md 40 px · lg 44 px tall. Link buttons have no padding (as in AlertItem 14:14179:
 * "Acknowledge" = link-gray gray-600, "View" / "View all alerts →" = link-color brand dark #471db0).
 */
const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "rounded-md bg-bg-brand-solid text-on-brand shadow-xs not-disabled:hover:bg-bg-brand-solid-hover " +
    "disabled:bg-bg-tertiary disabled:text-gray-400 disabled:shadow-xs disabled:ring-1 disabled:ring-inset disabled:ring-border-secondary",
  secondary:
    "rounded-md bg-bg-primary text-secondary shadow-xs ring-1 ring-inset ring-border-primary not-disabled:hover:bg-bg-secondary not-disabled:hover:text-gray-800 " +
    "disabled:bg-bg-primary disabled:text-gray-400 disabled:ring-border-secondary",
  "link-color": "rounded-xs text-brand-hover not-disabled:hover:underline not-disabled:hover:underline-offset-2 disabled:text-gray-400 disabled:no-underline",
  "link-gray": "rounded-xs text-tertiary not-disabled:hover:text-secondary disabled:text-gray-400",
};

const SOLID_SIZE: Record<ButtonSize, string> = {
  sm: "h-9 gap-1 px-3 text-sm",
  md: "h-10 gap-1 px-3.5 text-sm",
  lg: "h-11 gap-1.5 px-4 text-md",
};

const LINK_SIZE: Record<ButtonSize, string> = {
  sm: "gap-1.5 text-sm",
  md: "gap-1.5 text-sm",
  lg: "gap-1.5 text-md",
};

/** Class string for a button look — use on an `<a>` (e.g. inert "View full schedule →" links). */
export function buttonClasses({
  variant = "secondary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  const isLink = variant === "link-color" || variant === "link-gray";
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-semibold transition-colors duration-100 disabled:cursor-not-allowed",
    isLink ? LINK_SIZE[size] : SOLID_SIZE[size],
    VARIANT[variant],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeading?: IconComponent;
  iconTrailing?: IconComponent;
  children?: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  iconLeading: Leading,
  iconTrailing: Trailing,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  const icon = "size-5 shrink-0";
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {Leading && <Leading size={20} strokeWidth={iconStroke(20)} className={icon} />}
      {children}
      {Trailing && <Trailing size={20} strokeWidth={iconStroke(20)} className={icon} />}
    </button>
  );
}

export type IconButtonVariant = "secondary" | "tertiary";

const ICON_BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "size-9",
  md: "size-10",
  lg: "size-11",
};

const ICON_BUTTON_VARIANT: Record<IconButtonVariant, string> = {
  secondary: "bg-bg-primary text-gray-500 shadow-xs ring-1 ring-inset ring-border-primary hover:bg-bg-secondary hover:text-gray-600",
  tertiary: "text-gray-400 hover:bg-bg-secondary hover:text-gray-500",
};

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: IconComponent;
  /** Required: icon-only buttons need an accessible name. */
  "aria-label": string;
  size?: ButtonSize;
  variant?: IconButtonVariant;
}

/** Square icon-only button (e.g. the × close in sheets / slide-outs). */
export function IconButton({
  icon: Icon,
  size = "md",
  variant = "tertiary",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-50",
        ICON_BUTTON_SIZE[size],
        ICON_BUTTON_VARIANT[variant],
        className,
      )}
      {...rest}
    >
      <Icon size={20} strokeWidth={iconStroke(20)} className="size-5" />
    </button>
  );
}
