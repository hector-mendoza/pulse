"use client";

import { useSyncExternalStore } from "react";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";
import {
  subscribeTheme,
  getThemeMode,
  getThemeModeServerSnapshot,
  setThemeMode,
} from "@/lib/theme-store";

const CYCLE = {
  light: { next: "dark", icon: "Moon", label: "Dark mode" },
  dark: { next: "system", icon: "Monitor", label: "Match system" },
  system: { next: "light", icon: "Sun", label: "Light mode" },
};

export function ThemeToggle({ className }) {
  const mode = useSyncExternalStore(
    subscribeTheme,
    getThemeMode,
    getThemeModeServerSnapshot
  );

  const step = CYCLE[mode] ?? CYCLE.system;

  return (
    <button
      type="button"
      onClick={() => {
        haptic("toggle");
        setThemeMode(step.next);
      }}
      className={className}
    >
      <NavIcon name={step.icon} size={17} />
      {step.label}
    </button>
  );
}
