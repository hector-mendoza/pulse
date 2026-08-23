/**
 * Shared by the server-rendered inline theme script and the client theme
 * store, so this module deliberately carries no "use client" directive.
 */
export const MODE_KEY = "pulse-theme";
export const ACCENT_KEY = "pulse-accent";

export const MODES = ["light", "dark", "system"];

/** Page background per resolved scheme — mirrors `--background` in globals.css. */
export const SCHEME_BACKGROUND = {
  light: "#f6f7f9",
  dark: "#0b0d10",
};
