import { Skeleton } from "./Skeleton";

export function AnalyticsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-[110px] rounded-2xl" />
        <Skeleton className="h-[110px] rounded-2xl" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[170px] rounded-2xl" />
        <Skeleton className="h-[170px] rounded-2xl" />
      </div>
    </>
  );
}
