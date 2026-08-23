"use client";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useNav } from "@/components/NavProvider";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";

export function TabBar() {
  const { active, setActive } = useNav();

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-30 flex justify-center px-5 lg:hidden"
    >
      {/* Floating pill: it hugs its contents and lets the page scroll
          underneath, so the blur has something to work with. */}
      <div className="glass lift-shadow pointer-events-auto flex items-center gap-1 rounded-[26px] border border-panel-border p-1.5">
        {NAV_ITEMS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (!isActive) haptic("select");
                setActive(tab.id);
              }}
              className={cn(
                "pressable-sm flex h-11 items-center rounded-[20px] px-3.5",
                "transition-[background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "bg-accent text-primary"
                  : "text-text-dim hover:text-foreground"
              )}
            >
              <NavIcon name={tab.icon} size={19} />
              {/* Only the current section spells itself out. The width
                  animates, so the pill grows around the label rather than the
                  text popping into a fixed slot. */}
              <span
                className={cn(
                  "overflow-hidden text-[12.5px] font-semibold whitespace-nowrap",
                  "transition-[max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive ? "max-w-24 pl-1.5 opacity-100" : "max-w-0 pl-0 opacity-0"
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
