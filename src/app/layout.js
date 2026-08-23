import { Inter, JetBrains_Mono } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ThemeSync } from "@/components/ThemeSync";
import { ACCENT_IDS, DEFAULT_ACCENT } from "@/lib/accents";
import {
  MODE_KEY,
  ACCENT_KEY,
  SCHEME_BACKGROUND,
} from "@/lib/theme-constants";
import "./globals.css";

/**
 * Runs while the HTML is still being parsed, before the first paint, so the
 * saved scheme and accent are already on `<html>` when pixels hit the screen.
 * Anything slower than this (an effect, a client component) shows a flash of
 * the wrong theme on a cold start — exactly what breaks the native illusion.
 */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var root = document.documentElement;
    var mode = localStorage.getItem(${JSON.stringify(MODE_KEY)});
    if (mode !== "dark" && mode !== "light") mode = "system";
    var isDark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", isDark);

    var accents = ${JSON.stringify(ACCENT_IDS)};
    var accent = localStorage.getItem(${JSON.stringify(ACCENT_KEY)});
    if (accents.indexOf(accent) === -1) accent = ${JSON.stringify(DEFAULT_ACCENT)};
    root.setAttribute("data-accent", accent);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      isDark
        ? ${JSON.stringify(SCHEME_BACKGROUND.dark)}
        : ${JSON.stringify(SCHEME_BACKGROUND.light)}
    );
  } catch (e) {}
})();
`;

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pulse — Vercel deployments",
  description: "Monitor Vercel deployments and analytics from your iPhone.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pulse",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // `theme-color` is intentionally omitted: the inline script above owns that
  // meta tag so it can track the user's chosen scheme rather than a fixed one.
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-accent={DEFAULT_ACCENT}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeSync />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
