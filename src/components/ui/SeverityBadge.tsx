import { AlertOctagon, AlertTriangle, InfoCircle } from "@untitledui/icons";
import type { Severity } from "@/data/scenario";
import { Badge, type BadgeColor } from "./Badge";
import type { IconComponent } from "./icon";

/** Figma SeverityBadge 11:3390 — shape encodes severity (octagon / triangle / circle). */
const SEVERITY: Record<Severity, { color: BadgeColor; icon: IconComponent; label: string }> = {
  critical: { color: "error", icon: AlertOctagon, label: "Critical" },
  warning: { color: "warning", icon: AlertTriangle, label: "Warning" },
  info: { color: "blue", icon: InfoCircle, label: "Info" },
};

export interface SeverityBadgeProps {
  severity: Severity;
  /** Defaults to "Critical" / "Warning" / "Info". */
  label?: string;
  className?: string;
}

export function SeverityBadge({ severity, label, className }: SeverityBadgeProps) {
  const s = SEVERITY[severity];
  return (
    <Badge color={s.color} icon={s.icon} className={className}>
      {label ?? s.label}
    </Badge>
  );
}
