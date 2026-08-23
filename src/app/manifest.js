import { SCHEME_BACKGROUND } from "@/lib/theme-constants";

export default function manifest() {
  return {
    name: "Pulse — Vercel deployments",
    short_name: "Pulse",
    description: "Monitor Vercel deployments and analytics from your phone.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Falls back down the list on platforms that don't support the one above,
    // ending at a plain browser tab.
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "portrait",
    background_color: SCHEME_BACKGROUND.light,
    theme_color: SCHEME_BACKGROUND.light,
    categories: ["developer", "productivity", "utilities"],
    icons: [
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Deploys",
        short_name: "Deploys",
        description: "Latest deployment activity",
        url: "/",
      },
      {
        name: "Settings",
        short_name: "Settings",
        description: "Vercel connection and appearance",
        url: "/?tab=settings",
      },
    ],
  };
}
