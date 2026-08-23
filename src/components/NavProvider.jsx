"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

const NavContext = createContext(null);

const TAB_IDS = NAV_ITEMS.map((item) => item.id);

export function NavProvider({ children }) {
  // Home-screen shortcuts land on `/?tab=…`. Both routes using this provider
  // render on demand, so the search params are known on the server too and the
  // first client render matches.
  const requestedTab = useSearchParams().get("tab");
  const [active, setActiveState] = useState(() =>
    TAB_IDS.includes(requestedTab) ? requestedTab : "deploys"
  );
  // Which way the new pane should enter: "forward" when moving right through
  // the tab order, "back" when moving left. Kept out of state so a re-render
  // can read it without an extra pass.
  const direction = useRef("forward");

  const setActive = useCallback((next) => {
    setActiveState((current) => {
      if (next === current) return current;
      direction.current =
        TAB_IDS.indexOf(next) > TAB_IDS.indexOf(current) ? "forward" : "back";
      return next;
    });
  }, []);

  /** Move by one tab; used by the horizontal swipe gesture. */
  const shiftActive = useCallback((delta) => {
    setActiveState((current) => {
      const index = TAB_IDS.indexOf(current);
      const nextIndex = index + delta;
      if (nextIndex < 0 || nextIndex >= TAB_IDS.length) return current;
      direction.current = delta > 0 ? "forward" : "back";
      return TAB_IDS[nextIndex];
    });
  }, []);

  const value = useMemo(
    () => ({ active, setActive, shiftActive, direction }),
    [active, setActive, shiftActive],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within a NavProvider");
  return ctx;
}
