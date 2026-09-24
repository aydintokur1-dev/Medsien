import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "./Badge";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  children: ReactNode;
}

/**
 * Small grey chip used in AlertItem 14:14179 for the owner and linked objects
 * (gray-50 fill, gray-200 stroke, Text xs/Medium gray-700, px 8 · py 2, pill).
 */
export function Tag({ children, ...rest }: TagProps) {
  return (
    <Badge color="gray" size="sm" {...rest}>
      {children}
    </Badge>
  );
}
