/**
 * Accent themes. Each id matches a `[data-accent="…"]` block in globals.css,
 * which supplies the four seed colors every other token is derived from.
 *
 * `swatch` is only used to paint the picker: `deep` is what the accent looks
 * like in light mode, `bright` in dark mode.
 */
export const ACCENTS = [
  { id: "mint", label: "Mint", deep: "#0e4b36", bright: "#2fd9a8" },
  { id: "iris", label: "Iris", deep: "#4338ca", bright: "#8b93ff" },
  { id: "violet", label: "Violet", deep: "#6d28d9", bright: "#c084fc" },
  { id: "cyan", label: "Cyan", deep: "#0e7490", bright: "#22d3ee" },
  { id: "lime", label: "Lime", deep: "#4d7c0f", bright: "#a3e635" },
  { id: "sunset", label: "Sunset", deep: "#c2410c", bright: "#fb923c" },
  { id: "rose", label: "Rose", deep: "#be123c", bright: "#fb7185" },
  { id: "mono", label: "Mono", deep: "#111827", bright: "#e5e7eb" },
];

export const DEFAULT_ACCENT = "mint";

export const ACCENT_IDS = ACCENTS.map((a) => a.id);

export function isAccent(value) {
  return ACCENT_IDS.includes(value);
}
