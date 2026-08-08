"use client";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useNav } from "@/components/NavProvider";
import { NavIcon } from "@/components/icons";

export function TabBar() {
  const { active, setActive } = useNav();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-[480px] justify-around border-t border-panel-border bg-panel/92 px-5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      {NAV_ITEMS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActive(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 text-text-faint",
            active === tab.id && "text-primary"
          )}
        >
          <NavIcon name={tab.icon} size={19} />
          <span className="text-[10px] font-semibold tracking-wide">
            {tab.label}
          </span>
          <span
            className={cn(
              "mt-px h-[5px] w-[5px] rounded-full bg-primary opacity-0",
              active === tab.id && "opacity-100"
            )}
          />
        </button>
      ))}
    </nav>
  );
}
