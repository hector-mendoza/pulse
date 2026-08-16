import { SidebarSkeleton } from "@/components/skeletons/SidebarSkeleton";
import { TopbarSkeleton } from "@/components/skeletons/TopbarSkeleton";
import { DashboardContentSkeleton } from "@/components/skeletons/DashboardContentSkeleton";

export default function Loading() {
  return (
    <div className="lg:flex lg:min-h-screen lg:gap-3">
      <SidebarSkeleton />

      <div className="mx-auto w-full max-w-[480px] pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+84px)] lg:max-w-none lg:flex-1 lg:pt-0 lg:pb-0">
        <TopbarSkeleton />
        <DashboardContentSkeleton />
      </div>
    </div>
  );
}
