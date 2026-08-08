"use client";

import { createContext, useContext, useState } from "react";

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [active, setActive] = useState("deploys");

  return (
    <NavContext.Provider value={{ active, setActive }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within a NavProvider");
  return ctx;
}
