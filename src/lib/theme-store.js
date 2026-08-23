"use client";

import { DEFAULT_ACCENT, isAccent } from "@/lib/accents";
import {
  MODE_KEY,
  ACCENT_KEY,
  MODES,
  SCHEME_BACKGROUND,
} from "@/lib/theme-constants";

export { MODES };

const listeners = new Set();

/**
 * Snapshots are cached so `useSyncExternalStore` doesn't hit localStorage on
 * every render, and so each snapshot getter returns a referentially stable
 * value between notifications.
 */
let cachedMode = null;
let cachedAccent = null;
let cachedIsDark = null;
let mediaQuery = null;

function emit() {
  listeners.forEach((cb) => cb());
}

function readStoredMode() {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    return MODES.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function readStoredAccent() {
  try {
    const stored = localStorage.getItem(ACCENT_KEY);
    return isAccent(stored) ? stored : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

function prefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveIsDark(mode) {
  return mode === "dark" || (mode === "system" && prefersDark());
}

/**
 * The status/address bar tint. Keeping it in step with the page background is
 * what makes an installed PWA read as one continuous surface rather than a
 * web page inside a chrome-colored frame.
 */
function syncThemeColor(isDark) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute(
    "content",
    isDark ? SCHEME_BACKGROUND.dark : SCHEME_BACKGROUND.light
  );
}

function applyMode(mode) {
  const isDark = resolveIsDark(mode);
  document.documentElement.classList.toggle("dark", isDark);
  syncThemeColor(isDark);
  cachedMode = mode;
  cachedIsDark = isDark;
}

function applyAccent(accent) {
  document.documentElement.setAttribute("data-accent", accent);
  cachedAccent = accent;
}

function ensureMediaListener() {
  if (mediaQuery || typeof window === "undefined") return;
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (getThemeMode() !== "system") return;
    applyMode("system");
    emit();
  });
}

export function subscribeTheme(callback) {
  ensureMediaListener();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getThemeMode() {
  if (cachedMode === null) cachedMode = readStoredMode();
  return cachedMode;
}

export function getAccent() {
  if (cachedAccent === null) cachedAccent = readStoredAccent();
  return cachedAccent;
}

export function getIsDark() {
  if (cachedIsDark === null) cachedIsDark = resolveIsDark(getThemeMode());
  return cachedIsDark;
}

/* Server snapshots: the markup is rendered scheme-agnostic and the inline
   script in the layout corrects the DOM before first paint. */
export function getThemeModeServerSnapshot() {
  return "system";
}

export function getAccentServerSnapshot() {
  return DEFAULT_ACCENT;
}

export function getIsDarkServerSnapshot() {
  return false;
}

export function setThemeMode(mode) {
  if (!MODES.includes(mode)) return;
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* Private mode / storage disabled — the choice just won't persist. */
  }
  applyMode(mode);
  emit();
}

export function setAccent(accent) {
  if (!isAccent(accent)) return;
  try {
    localStorage.setItem(ACCENT_KEY, accent);
  } catch {
    /* Ignored, as above. */
  }
  applyAccent(accent);
  emit();
}

/**
 * Re-applies the stored theme to `<html>`. Needed because React's Strict Mode
 * remount in development resets the element to the attributes it manages from
 * JSX, discarding what the inline script set. A no-op in production.
 */
export function rehydrateTheme() {
  applyMode(readStoredMode());
  applyAccent(readStoredAccent());
  emit();
}
