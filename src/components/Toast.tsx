"use client";

import { useEffect } from "react";
import { CheckCircle, InfoCircle, XClose } from "@untitledui/icons";
import { iconStroke } from "@/components/ui";

/*
 * Confirmation after acknowledging an alert: "Alert acknowledged" + Undo (5 s).
 * Described in the design notes, not drawn — built from kit tokens (white, border-secondary, radius 12, shadow-lg).
 * tone "info" (grey info icon) = a link to a screen the case study does not design.
 */
export function Toast({
  message,
  id,
  tone = "success",
  onUndo,
  onDismiss,
}: {
  message: string | null;
  /** Changes on every new toast, so repeating the same message restarts the 5 s timer and is announced again. */
  id?: number;
  tone?: "success" | "info";
  onUndo?: () => void;
  onDismiss: () => void;
}) {
  const Icon = tone === "info" ? InfoCircle : CheckCircle;
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(t);
  }, [message, id, onDismiss]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      {message && (
        <div key={id} className="animate-toast-in pointer-events-auto flex w-full max-w-[400px] items-center gap-3 rounded-xl border border-border-secondary bg-bg-primary py-3 pl-4 pr-2 shadow-lg">
          <Icon size={20} strokeWidth={iconStroke(20)} className={tone === "info" ? "shrink-0 text-quaternary" : "shrink-0 text-success-600"} aria-hidden="true" />
          <p className="min-w-0 flex-1 text-sm font-semibold text-primary">{message}</p>
          {onUndo && (
            <button type="button" onClick={onUndo} className="shrink-0 rounded-sm px-2 py-1 text-sm font-semibold text-brand-hover hover:bg-bg-secondary">
              Undo
            </button>
          )}
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className="flex size-8 shrink-0 items-center justify-center rounded-md text-quaternary hover:bg-bg-secondary">
            <XClose size={16} strokeWidth={iconStroke(16)} />
          </button>
        </div>
      )}
    </div>
  );
}
