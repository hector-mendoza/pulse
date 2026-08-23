"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useNav } from "@/components/NavProvider";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";

/** Horizontal travel before a press turns into a drag. */
const SCRUB_THRESHOLD = 8;
/** Window after a drag in which a trailing click is treated as its echo. */
const CLICK_ECHO_MS = 250;

export function TabBar() {
  const { active, setActive } = useNav();

  const pillRef = useRef(null);
  const buttonRefs = useRef([]);
  const gesture = useRef(null);
  const dragEndedAt = useRef(0);

  /** Index the finger is currently over; null when no drag is in progress. */
  const [scrubIndex, setScrubIndex] = useState(null);
  /**
   * The pill's width is pinned for the duration of a drag. Collapsing the
   * labels shrinks a `w-fit` pill, and because it is centred that would slide
   * the whole control out from under the finger mid-gesture.
   */
  const [pinnedWidth, setPinnedWidth] = useState(null);

  const scrubbing = scrubIndex !== null;
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((tab) => tab.id === active),
  );
  const highlightIndex = scrubbing ? scrubIndex : activeIndex;

  // Nearest centre rather than strict containment, so a drag that overshoots
  // either end of the bar still resolves to the tab at that end.
  const indexFromPoint = useCallback((clientX) => {
    let best = 0;
    let bestDistance = Infinity;
    buttonRefs.current.forEach((node, index) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const distance = Math.abs(clientX - (rect.left + rect.width / 2));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    return best;
  }, []);

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // Nothing visual happens yet — a plain tap must not flicker the label
    // closed and open again, so arming waits for actual movement.
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      armed: false,
      index: null,
    };
  }

  function handlePointerMove(event) {
    const current = gesture.current;
    if (!current || event.pointerId !== current.pointerId) return;

    if (!current.armed) {
      if (Math.abs(event.clientX - current.startX) < SCRUB_THRESHOLD) return;
      current.armed = true;

      const pill = pillRef.current;
      if (pill) {
        setPinnedWidth(pill.getBoundingClientRect().width);
        // Captured only once this is definitely a drag: capturing on press
        // retargets a tap's click away from the button that was pressed.
        pill.setPointerCapture(event.pointerId);
      }
      current.index = indexFromPoint(event.clientX);
      setScrubIndex(current.index);
      return;
    }

    const next = indexFromPoint(event.clientX);
    if (next === current.index) return;
    current.index = next;
    // One tick per tab crossed, so the bar can be scrubbed by feel.
    haptic("select");
    setScrubIndex(next);
  }

  function handlePointerUp() {
    const current = gesture.current;
    gesture.current = null;
    if (!current?.armed) return;

    setScrubIndex(null);
    setPinnedWidth(null);
    dragEndedAt.current = Date.now();

    // Committing only on release means dragging from the first tab to the last
    // switches screens once, instead of mounting every pane on the way past.
    const target = NAV_ITEMS[current.index];
    if (target && target.id !== active) {
      haptic("toggle");
      setActive(target.id);
    }
  }

  function handlePointerCancel() {
    if (gesture.current?.armed) dragEndedAt.current = Date.now();
    gesture.current = null;
    setScrubIndex(null);
    setPinnedWidth(null);
  }

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-30 flex justify-center px-5 lg:hidden"
    >
      <div className="pointer-events-auto relative">
        {/* The target's name, parked above the bar. It lives outside the pill
            so naming the tab can't change the geometry being dragged on. */}
        <span
          aria-hidden="true"
          className={cn(
            "glass card-shadow absolute bottom-full mb-2 -translate-x-1/2 rounded-full",
            "border border-panel-border px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap",
            "transition-[left,opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrubbing ? "opacity-100" : "opacity-0",
          )}
          style={{
            left: `${((highlightIndex + 0.5) * 100) / NAV_ITEMS.length}%`,
          }}
        >
          {NAV_ITEMS[highlightIndex]?.label}
        </span>

        {/* Floating pill: it hugs its contents and lets the page scroll
            underneath, so the blur has something to work with. */}
        <div
          ref={pillRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          // The bar owns horizontal gestures outright; without this the
          // browser claims the drag for scrolling and the pointer stream stops.
          style={{ touchAction: "none", width: pinnedWidth ?? undefined }}
          className="glass lift-shadow flex items-center gap-1 rounded-[26px] border border-panel-border p-1.5"
        >
          {NAV_ITEMS.map((tab, index) => {
            const isActive = active === tab.id;
            const isHighlighted = highlightIndex === index;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  // A drag can emit a trailing click; the release already
                  // decided where to land, so ignore it.
                  if (Date.now() - dragEndedAt.current < CLICK_ECHO_MS) return;
                  if (!isActive) haptic("select");
                  setActive(tab.id);
                }}
                className={cn(
                  "pressable-sm flex h-11 items-center justify-center rounded-[20px]",
                  "transition-[background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  // Equal columns while dragging: uniform hit zones that don't
                  // shift as the highlight moves between them.
                  scrubbing ? "flex-1 px-0" : "px-3.5",
                  isHighlighted
                    ? "bg-accent text-primary"
                    : "text-text-dim hover:text-foreground",
                )}
              >
                <NavIcon name={tab.icon} size={19} />
                {/* Only the settled section spells itself out. The width
                    animates, so the pill grows around the label rather than
                    the text popping into a fixed slot. */}
                <span
                  className={cn(
                    "overflow-hidden text-[12.5px] font-semibold whitespace-nowrap",
                    "transition-[max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive && !scrubbing
                      ? "max-w-24 pl-1.5 opacity-100"
                      : "max-w-0 pl-0 opacity-0",
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
