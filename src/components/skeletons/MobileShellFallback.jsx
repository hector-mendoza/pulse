import { TopbarSkeleton } from "./TopbarSkeleton";
import { DashboardContentSkeleton } from "./DashboardContentSkeleton";
import { TabBarSkeleton } from "./TabBarSkeleton";

/** Hand-crafted mobile shell skeleton — shown until boneyard bones resolve. */
export function MobileShellFallback() {
  return (
    <div className="mx-auto w-full max-w-[480px] pb-[calc(env(safe-area-inset-bottom)+96px)]">
      <TopbarSkeleton />
      <DashboardContentSkeleton />
      <TabBarSkeleton />
    </div>
  );
}
