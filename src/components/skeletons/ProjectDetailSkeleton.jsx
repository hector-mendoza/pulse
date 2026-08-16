import { Skeleton } from "./Skeleton";

export function ProjectDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[480px] pt-[env(safe-area-inset-top)] pb-8 lg:max-w-none lg:flex-1 lg:pt-0">
      <div className="px-5 pt-6 pb-5 lg:mx-3 lg:mt-3 lg:rounded-2xl lg:border lg:border-panel-border lg:bg-panel lg:px-6 lg:py-5 lg:pt-5 card-shadow">
        <Skeleton className="mb-3 h-3.5 w-28" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-3 w-24" />
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 lg:mx-auto lg:max-w-5xl lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-[190px] rounded-2xl" />
          <Skeleton className="h-[190px] rounded-2xl" />
          <Skeleton className="h-[190px] rounded-2xl" />
        </div>

        <div>
          <Skeleton className="mb-3.5 h-3 w-28" />
          <div className="flex flex-col gap-[22px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[70px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
