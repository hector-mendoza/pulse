import { Skeleton } from "./Skeleton";

export function DashboardContentSkeleton() {
  return (
    <div className="lg:mx-auto lg:max-w-6xl lg:px-8 lg:py-8">
      <div className="mb-5 hidden items-center justify-between lg:flex">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-3.5 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-5 lg:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 flex-none rounded-full" />
        ))}
      </div>

      <div className="flex flex-col gap-4 px-5 lg:px-0">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] rounded-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-[190px] rounded-2xl" />
          <Skeleton className="h-[190px] rounded-2xl" />
          <Skeleton className="h-[190px] rounded-2xl" />
        </div>

        <Skeleton className="h-[150px] rounded-2xl lg:max-w-sm" />

        <div>
          <Skeleton className="mb-3.5 h-3 w-32" />
          <div className="flex flex-col gap-[22px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[70px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
