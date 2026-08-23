"use client";

import { useCallback, useRef, useState } from "react";

/** Movement before we decide whether this is a horizontal or vertical gesture. */
const AXIS_LOCK = 10;
/** Distance that commits to a page change on a slow drag. */
const TRIGGER_DISTANCE = 64;
/** How far the pane is allowed to trail the finger. */
const MAX_DRAG = 84;
/** A short, fast drag counts even if it never reaches TRIGGER_DISTANCE. */
const FLICK_DISTANCE = 28;
const FLICK_MS = 260;

/**
 * Horizontal swipe navigation for the tab panes.
 *
 * The axis is locked on the first few pixels, so a vertical scroll started
 * inside the pane is never stolen, and any subtree marked
 * `data-swipe-ignore` (the horizontally scrollable project pills, for
 * instance) opts out entirely.
 *
 * Returns a live `offset` so the pane can trail the finger with resistance —
 * without that feedback a swipe feels like a button press, not a drag.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, enabled = true } = {}) {
  const start = useRef(null);
  const axis = useRef(null);
  const [offset, setOffset] = useState(0);

  const reset = useCallback(() => {
    start.current = null;
    axis.current = null;
    setOffset(0);
  }, []);

  const onTouchStart = useCallback(
    (event) => {
      if (!enabled || event.touches.length !== 1) return;
      if (event.target?.closest?.("[data-swipe-ignore]")) {
        start.current = null;
        return;
      }
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY, at: Date.now() };
      axis.current = null;
    },
    [enabled]
  );

  const onTouchMove = useCallback((event) => {
    if (!start.current) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.current.x;
    const dy = touch.clientY - start.current.y;

    if (!axis.current) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current !== "x") return;

    setOffset(Math.sign(dx) * Math.min(MAX_DRAG, Math.abs(dx) * 0.42));
  }, []);

  const onTouchEnd = useCallback(
    (event) => {
      const origin = start.current;
      const wasHorizontal = axis.current === "x";
      reset();
      if (!origin || !wasHorizontal) return;

      const dx = event.changedTouches[0].clientX - origin.x;
      const isFlick =
        Math.abs(dx) > FLICK_DISTANCE && Date.now() - origin.at < FLICK_MS;

      if (dx < 0 && (dx <= -TRIGGER_DISTANCE || isFlick)) onSwipeLeft?.();
      else if (dx > 0 && (dx >= TRIGGER_DISTANCE || isFlick)) onSwipeRight?.();
    },
    [onSwipeLeft, onSwipeRight, reset]
  );

  return {
    offset,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: reset,
    },
  };
}
