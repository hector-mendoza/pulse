export default function manifest() {
  return {
    name: "Pulse — Vercel deployments",
    short_name: "Pulse",
    description: "Monitor Vercel deployments and analytics from your phone.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f9",
    theme_color: "#f6f7f9",
    icons: [
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
