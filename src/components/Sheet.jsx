"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";

const EXIT_MS = 240;
/** Drag distance that dismisses on a slow pull. */
const DISMISS_DISTANCE = 104;
const FLICK_VELOCITY = 0.55; // px per ms

/**
 * A bottom sheet with drag-to-dismiss, the standard way a phone shows detail
 * without leaving the current screen.
 *
 * Rendered through a portal because the mobile shell lives inside a
 * transformed element (pull-to-refresh), and a transform makes an ancestor the
 * containing block for `position: fixed` descendants.
 */
export function Sheet({ open, onClose, title, subtitle, children }) {
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  // The sheet outlives `open` by one animation so it can play its exit.
  // Derived during render rather than in an effect, so closing never costs an
  // extra frame of the old state being painted.
  const [previousOpen, setPreviousOpen] = useState(open);
  const [closing, setClosing] = useState(false);

  if (open !== previousOpen) {
    setPreviousOpen(open);
    setClosing(!open);
    setDrag(0);
  }

  const mounted = open || closing;

  const gesture = useRef(null);

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => setClosing(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing]);

  useEffect(() => {
    if (!mounted) return;

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted, onClose]);

  const onTouchStart = useCallback((event) => {
    gesture.current = { y: event.touches[0].clientY, at: Date.now() };
    setDragging(true);
  }, []);

  const onTouchMove = useCallback((event) => {
    if (!gesture.current) return;
    const dy = event.touches[0].clientY - gesture.current.y;
    // Pulling up past the top gets stiff resistance instead of a gap.
    setDrag(dy > 0 ? dy : dy * 0.15);
  }, []);

  const onTouchEnd = useCallback(
    (event) => {
      const origin = gesture.current;
      gesture.current = null;
      setDragging(false);
      if (!origin) return;

      const dy = event.changedTouches[0].clientY - origin.y;
      const velocity = dy / Math.max(1, Date.now() - origin.at);

      if (dy > DISMISS_DISTANCE || velocity > FLICK_VELOCITY) {
        haptic("select");
        onClose();
      } else {
        setDrag(0);
      }
    },
    [onClose]
  );

  if (!mounted || typeof document === "undefined") return null;

  const dragHandlers = { onTouchStart, onTouchMove, onTouchEnd };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          background: "var(--scrim)",
          backdropFilter: "blur(2px)",
          animation: closing
            ? `scrim-in ${EXIT_MS}ms ease-in reverse both`
            : "scrim-in 220ms ease-out both",
          opacity: dragging ? Math.max(0.25, 1 - drag / 320) : undefined,
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full max-w-[480px] rounded-t-3xl border border-panel-border bg-panel pb-[env(safe-area-inset-bottom)]",
          "lg:mx-4 lg:max-w-md lg:rounded-3xl"
        )}
        style={{
          boxShadow: "var(--shadow-sheet)",
          transform: `translateY(${Math.max(0, drag)}px)`,
          transition: dragging
            ? "none"
            : `transform ${EXIT_MS}ms var(--ease-out-quint)`,
          animation: closing
            ? `sheet-out ${EXIT_MS}ms var(--ease-out-quint) both`
            : "sheet-in 320ms var(--ease-out-quint) both",
        }}
      >
        {/* Grabber. `touch-action: none` hands the whole gesture to us so the
            drag can't be mistaken for a scroll. */}
        <div
          {...dragHandlers}
          className="flex cursor-grab flex-col items-center px-5 pt-3 pb-1 active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          <span className="h-1 w-9 rounded-full bg-rail" />
        </div>

        <div
          {...dragHandlers}
          className="px-5 pt-2 pb-3"
          style={{ touchAction: "none" }}
        >
          <h2 className="text-[15px] leading-snug font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-1 font-mono text-[11.5px] text-text-faint">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-h-[62vh] overflow-y-auto overscroll-contain px-5 pb-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
