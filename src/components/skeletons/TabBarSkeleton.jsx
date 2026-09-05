import { Skeleton } from "./Skeleton";
import { NAV_ITEMS } from "@/lib/nav-items";

export function TabBarSkeleton() {
  return (
    <nav
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-30 flex justify-center px-5 lg:hidden"
    >
      <div className="glass lift-shadow flex items-center gap-1 rounded-[26px] border border-panel-border p-1.5">
        {NAV_ITEMS.map((tab) => (
          <Skeleton key={tab.id} className="h-11 w-11 rounded-[20px]" />
        ))}
      </div>
    </nav>
  );
}
