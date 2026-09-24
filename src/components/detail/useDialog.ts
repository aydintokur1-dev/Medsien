"use client";

import { useEffect, useRef } from "react";

/**
 * Dialog behaviour shared by the flight slide-out / sheet and the gate sheet:
 * Esc closes, focus moves into the dialog and returns to the opener on close,
 * Tab stays inside, and the page behind does not scroll.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const focusFirst = () => {
      const el = ref.current?.querySelector<HTMLElement>("[data-autofocus]") ?? ref.current;
      el?.focus({ preventScroll: true });
    };
    const t = window.setTimeout(focusFirst, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(
        ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return ref;
}
