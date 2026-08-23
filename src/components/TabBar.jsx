"use client";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useNav } from "@/components/NavProvider";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";

export function TabBar() {
  const { active, setActive } = useNav();
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((tab) => tab.id === active)
  );

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-panel-border px-3 pt-2 pb-[calc(9px+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="relative grid grid-cols-4">
        {/* The highlight travels between tabs rather than blinking on and off,
            so the change reads as movement instead of a repaint. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 rounded-2xl bg-accent transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
          style={{
            width: `${100 / NAV_ITEMS.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {NAV_ITEMS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (!isActive) haptic("select");
                setActive(tab.id);
              }}
              className={cn(
                "pressable-sm relative z-1 flex flex-col items-center gap-1 rounded-2xl py-1.5",
                isActive ? "text-primary" : "text-text-faint"
              )}
            >
              <NavIcon name={tab.icon} size={19} />
              <span
                className={cn(
                  "text-[10px] tracking-wide transition-all",
                  isActive ? "font-bold" : "font-semibold"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
