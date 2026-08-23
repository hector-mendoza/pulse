"use client";

import { useLayoutEffect } from "react";
import { rehydrateTheme } from "@/lib/theme-store";

/**
 * Re-applies the stored theme to `<html>` right after mount.
 *
 * The inline script in the root layout sets the class and `data-accent` during
 * HTML parsing, which is all a production build needs. In development React's
 * Strict Mode remounts once and resets `<html>` to the attributes it manages
 * from JSX, wiping them — this puts them back before paint.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    rehydrateTheme();
  }, []);

  return null;
}
