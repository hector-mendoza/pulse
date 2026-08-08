"use client";

import { useSyncExternalStore } from "react";
import { NavIcon } from "@/components/icons";
import {
  subscribeTheme,
  getThemeSnapshot,
  getThemeServerSnapshot,
  setTheme,
} from "@/lib/theme-store";

export function ThemeToggle({ className }) {
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  return (
    <button type="button" onClick={() => setTheme(!isDark)} className={className}>
      <NavIcon name={isDark ? "Sun" : "Moon"} size={17} />
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
