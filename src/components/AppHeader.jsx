"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { avatarUrl } from "@/lib/avatar";
import { useNav } from "@/components/NavProvider";
import { NAV_ITEMS } from "@/lib/nav-items";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function AppHeader({ projectsCount, userEmail, userName }) {
  const { active, setActive } = useNav();
  const [condensed, setCondensed] = useState(false);

  // The header only grows a border and blur once content passes underneath it,
  // so a screen scrolled to the top reads as one uninterrupted surface.
  useEffect(() => {
    function onScroll() {
      setCondensed(window.scrollY > 6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const title = NAV_ITEMS.find((item) => item.id === active)?.label ?? "Pulse";

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between px-5 pb-3.5 lg:hidden",
        "pt-[calc(env(safe-area-inset-top)+0.5rem)]",
        "transition-[background-color,border-color] duration-200",
        condensed
          ? "glass border-b border-panel-border"
          : "border-b border-transparent bg-background"
      )}
    >
      <button
        type="button"
        onClick={() => {
          haptic("select");
          setActive("deploys");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="pressable-sm flex items-center gap-2.5 text-left"
      >
        <span className="brand-mark flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[10px] font-mono text-sm font-bold">
          ▲
        </span>
        <span>
          <h1 className="text-[17px] font-semibold tracking-tight">
            {active === "deploys" ? "Pulse" : title}
          </h1>
          <small className="mt-px block text-[11px] font-medium text-text-dim">
            {projectsCount} project{projectsCount === 1 ? "" : "s"}
          </small>
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          haptic("select");
          setActive("settings");
        }}
        className="pressable-sm rounded-full"
        aria-label="Settings"
      >
        <Avatar
          className={cn(
            "h-8 w-8 ring-2 transition-colors",
            active === "settings" ? "ring-primary" : "ring-transparent"
          )}
        >
          <AvatarImage src={avatarUrl(userEmail || "pulse")} alt={userName} />
          <AvatarFallback className="bg-secondary text-[11px] text-secondary-foreground">
            {(userName || "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
    </header>
  );
}
