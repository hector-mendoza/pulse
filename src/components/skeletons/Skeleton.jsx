import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        // A sweep reads as "loading" where a pulse reads as "broken and
        // blinking" — and it keeps a steady rhythm across the whole screen
        // instead of every block fading in lockstep.
        "relative overflow-hidden rounded-md bg-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-panel-border after:to-transparent",
        className
      )}
      aria-hidden
    />
  );
}
