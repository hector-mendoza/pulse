"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { ACCENTS } from "@/lib/accents";
import { haptic } from "@/lib/haptics";
import { NavIcon } from "@/components/icons";
import {
  subscribeTheme,
  getThemeMode,
  getThemeModeServerSnapshot,
  getAccent,
  getAccentServerSnapshot,
  getIsDark,
  getIsDarkServerSnapshot,
  setThemeMode,
  setAccent,
} from "@/lib/theme-store";

const SCHEMES = [
  { id: "light", label: "Light", icon: "Sun" },
  { id: "dark", label: "Dark", icon: "Moon" },
  { id: "system", label: "Auto", icon: "Monitor" },
];

export function AppearanceSettings() {
  const mode = useSyncExternalStore(
    subscribeTheme,
    getThemeMode,
    getThemeModeServerSnapshot
  );
  const accent = useSyncExternalStore(
    subscribeTheme,
    getAccent,
    getAccentServerSnapshot
  );
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getIsDark,
    getIsDarkServerSnapshot
  );

  const activeIndex = Math.max(
    0,
    SCHEMES.findIndex((s) => s.id === mode)
  );

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h4 className="text-[12.5px] font-semibold">Theme</h4>
          <span className="text-[11.5px] text-text-faint">
            {mode === "system" ? "Following your device" : "Set manually"}
          </span>
        </div>

        {/* Segmented control: the thumb slides between options instead of the
            highlight jumping, so the change reads as one continuous motion. */}
        <div
          role="radiogroup"
          aria-label="Color scheme"
          className="relative grid grid-cols-3 gap-1 rounded-xl border border-panel-border bg-background p-1"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 rounded-lg bg-panel card-shadow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: "calc((100% - 1rem) / 3)",
              transform: `translateX(calc(${activeIndex} * (100% + 0.25rem)))`,
            }}
          />
          {SCHEMES.map((scheme) => {
            const isActive = mode === scheme.id;
            return (
              <button
                key={scheme.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => {
                  haptic("toggle");
                  setThemeMode(scheme.id);
                }}
                className={cn(
                  "relative z-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12.5px] font-medium transition-colors",
                  isActive ? "font-semibold text-foreground" : "text-text-dim"
                )}
              >
                <NavIcon name={scheme.icon} size={14} />
                {scheme.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h4 className="text-[12.5px] font-semibold">Accent</h4>
          <span className="text-[11.5px] text-text-faint capitalize">
            {ACCENTS.find((a) => a.id === accent)?.label}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Accent color"
          className="grid grid-cols-4 gap-2.5"
        >
          {ACCENTS.map((option) => {
            const isActive = accent === option.id;
            // Preview the swatch in the scheme the user is actually looking at.
            const swatch = isDark ? option.bright : option.deep;
            const trailing = isDark ? option.deep : option.bright;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={option.label}
                title={option.label}
                onClick={() => {
                  haptic("select");
                  setAccent(option.id);
                }}
                className={cn(
                  "pressable group flex flex-col items-center gap-1.5 rounded-xl border p-2",
                  isActive
                    ? "border-primary bg-accent"
                    : "border-panel-border bg-background"
                )}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundImage: `linear-gradient(150deg, ${trailing}, ${swatch})`,
                  }}
                >
                  {isActive && (
                    <NavIcon
                      name="Check"
                      size={15}
                      className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10.5px] font-medium",
                    isActive ? "text-primary" : "text-text-faint"
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-text-faint">
          The accent tints buttons, charts and highlights. Deploy statuses keep
          their own colors so ready, building and failed stay readable.
        </p>
      </section>
    </div>
  );
}
