import { SidebarSkeleton } from "@/components/skeletons/SidebarSkeleton";
import { TopbarSkeleton } from "@/components/skeletons/TopbarSkeleton";
import { DashboardContentSkeleton } from "@/components/skeletons/DashboardContentSkeleton";
import { IosEntrySkeleton } from "@/components/skeletons/IosEntrySkeleton";

export default function Loading() {
  return (
    <>
      {/* iOS / mobile PWA: pixel-perfect boneyard skeleton */}
      <div className="lg:hidden">
        <IosEntrySkeleton />
      </div>

      {/* Desktop: hand-crafted skeletons */}
      <div className="hidden lg:flex lg:min-h-screen lg:gap-3">
        <SidebarSkeleton />
        <div className="mx-auto w-full max-w-[480px] lg:max-w-none lg:flex-1 lg:pt-0 lg:pb-0">
          <TopbarSkeleton />
          <DashboardContentSkeleton />
        </div>
      </div>
    </>
  );
}
