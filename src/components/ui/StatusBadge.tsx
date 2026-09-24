import { ArrowCircleDown, CheckCircle, Clock, LogIn01, XCircle } from "@untitledui/icons";
import type { StatusKind } from "@/data/scenario";
import { Badge, type BadgeColor } from "./Badge";
import type { IconComponent } from "./icon";

/** Figma StatusBadge 11:3368 — one per flight. */
const STATUS: Record<StatusKind, { color: BadgeColor; icon: IconComponent; iconClassName?: string }> = {
  "delayed-long": { color: "orange", icon: Clock },
  delayed: { color: "warning", icon: Clock },
  // Grey badge, but the check-circle keeps its success-600 stroke (as in the kit file).
  "on-time": { color: "gray", icon: CheckCircle, iconClassName: "text-success-600" },
  early: { color: "indigo", icon: ArrowCircleDown },
  boarding: { color: "blue", icon: LogIn01 },
  cancelled: { color: "error", icon: XCircle },
};

export interface StatusBadgeProps {
  kind: StatusKind;
  label: string;
  className?: string;
}

export function StatusBadge({ kind, label, className }: StatusBadgeProps) {
  const s = STATUS[kind];
  return (
    <Badge color={s.color} icon={s.icon} iconClassName={s.iconClassName} className={className}>
      {label}
    </Badge>
  );
}
