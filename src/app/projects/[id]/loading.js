import { SidebarSkeleton } from "@/components/skeletons/SidebarSkeleton";
import { ProjectDetailSkeleton } from "@/components/skeletons/ProjectDetailSkeleton";

export default function Loading() {
  return (
    <div className="lg:flex lg:min-h-screen lg:gap-3">
      <SidebarSkeleton />
      <ProjectDetailSkeleton />
    </div>
  );
}
