"use client";

import { useEffect, useState } from "react";
import { NavIcon } from "@/components/icons";
import { SearchModal } from "@/components/SearchModal";

export function DesktopTopbar({ projects }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac] = useState(
    () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
  );

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="hidden items-center gap-3 lg:mx-3 lg:mt-3 lg:flex lg:rounded-2xl lg:border lg:border-panel-border lg:bg-panel lg:px-5 lg:py-3 card-shadow">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-panel-border text-text-dim hover:text-foreground"
        >
          <NavIcon name="Search" size={17} />
        </button>
        <kbd
          suppressHydrationWarning
          className="rounded border border-panel-border px-1.5 py-0.5 font-mono text-[10.5px] text-text-faint"
        >
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>

      </div>

      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} projects={projects} />
      )}
    </>
  );
}
