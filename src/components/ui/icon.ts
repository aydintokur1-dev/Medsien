import type { FC, SVGProps } from "react";

/** Shape of an `@untitledui/icons` component (e.g. `Clock`, `SearchLg`). */
export type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number; color?: string }>;

/**
 * The Untitled UI icon set is drawn on a 24-unit grid with a 2-unit stroke.
 * The Figma kit keeps a 1.5 px stroke at every icon size, so scale the stroke
 * to the rendered size: 12 px → 3, 14 px → 2.57, 16 px → 2.25, 20 px → 1.8.
 */
export function iconStroke(sizePx: number): number {
  return (1.5 * 24) / sizePx;
}
