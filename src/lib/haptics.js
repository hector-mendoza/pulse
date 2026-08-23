"use client";

/**
 * Tiny haptic taps for touch interactions.
 *
 * `navigator.vibrate` is Android/Chromium only — iOS Safari has no web haptics
 * API — so this is a progressive enhancement that silently no-ops elsewhere.
 */
const PATTERNS = {
  select: 8,
  toggle: 12,
  commit: [10, 24, 10],
};

export function haptic(kind = "select") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  try {
    navigator.vibrate(PATTERNS[kind] ?? PATTERNS.select);
  } catch {
    /* Some browsers throw when vibration is blocked by user settings. */
  }
}
