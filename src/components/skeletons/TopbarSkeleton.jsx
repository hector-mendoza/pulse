import { Skeleton } from "./Skeleton";

export function TopbarSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-2 pb-[18px] lg:hidden">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-[30px] w-[30px] rounded-lg" />
          <div>
            <Skeleton className="h-4 w-14" />
            <Skeleton className="mt-1 h-2.5 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="hidden items-center gap-3 lg:mx-3 lg:mt-3 lg:flex lg:rounded-2xl lg:border lg:border-panel-border lg:bg-panel lg:px-5 lg:py-3 card-shadow">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-4 w-14" />
        <div className="flex-1" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </>
  );
}
