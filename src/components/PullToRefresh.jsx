"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { NavIcon } from "@/components/icons";

const THRESHOLD = 72;
const MAX_PULL = 118;
const SPINNER_REST = 54;

/**
 * Pull-to-refresh for the mobile shell.
 *
 * The listeners are attached manually with `{ passive: false }` because React
 * registers `touchmove` passively — without that, `preventDefault()` is
 * ignored and iOS rubber-bands the whole document instead of letting us drive
 * the gesture.
 */
export function PullToRefresh({ children, className }) {
  const containerRef = useRef(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const gesture = useRef({ startY: 0, active: false, armed: false });
  const refreshingRef = useRef(false);

  useEffect(() => {
    refreshingRef.current = refreshing;
  }, [refreshing]);

  // The transition settles once the server components have re-rendered; that's
  // the honest moment to retract the spinner.
  useEffect(() => {
    if (refreshing && !isPending) {
      const timer = setTimeout(() => {
        setRefreshing(false);
        setPull(0);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [refreshing, isPending]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    function onTouchStart(event) {
      if (event.touches.length !== 1 || refreshingRef.current) return;
      if (window.scrollY > 0) return;
      gesture.current = {
        startY: event.touches[0].clientY,
        active: true,
        armed: false,
      };
    }

    function onTouchMove(event) {
      if (!gesture.current.active) return;

      const delta = event.touches[0].clientY - gesture.current.startY;
      if (delta <= 0 || window.scrollY > 0) {
        gesture.current.active = false;
        setPull(0);
        return;
      }

      event.preventDefault();

      // Resistance curve: the further you pull, the less it gives.
      const resisted = Math.min(MAX_PULL, delta * 0.5);
      setPull(resisted);

      if (resisted >= THRESHOLD && !gesture.current.armed) {
        gesture.current.armed = true;
        haptic("select");
      } else if (resisted < THRESHOLD) {
        gesture.current.armed = false;
      }
    }

    function onTouchEnd() {
      if (!gesture.current.active) return;
      const armed = gesture.current.armed;
      gesture.current = { startY: 0, active: false, armed: false };

      if (!armed) {
        setPull(0);
        return;
      }

      haptic("commit");
      setPull(SPINNER_REST);
      setRefreshing(true);
      startTransition(() => router.refresh());
    }

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd, { passive: true });
    node.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
      node.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [router]);

  const armed = pull >= THRESHOLD;
  const settling = pull === 0 || refreshing;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        aria-hidden={!refreshing}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center"
        style={{
          transform: `translateY(${Math.max(0, pull - 34)}px)`,
          opacity: Math.min(1, pull / 42),
          transition: settling
            ? "transform 320ms var(--ease-out-quint), opacity 220ms ease-out"
            : "none",
        }}
      >
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border border-panel-border bg-panel card-shadow",
            armed ? "text-primary" : "text-text-faint"
          )}
          style={{
            transform: refreshing ? undefined : `rotate(${pull * 3}deg)`,
          }}
        >
          <NavIcon
            name="RefreshCw"
            size={16}
            className={refreshing ? "animate-[spin-slow_900ms_linear_infinite]" : undefined}
          />
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${pull}px)`,
          transition: settling
            ? "transform 320ms var(--ease-out-quint)"
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
