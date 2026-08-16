import { Skeleton } from "./Skeleton";

export function SidebarSkeleton() {
  return (
    <aside className="hidden lg:sticky lg:top-3 lg:my-3 lg:ml-3 lg:flex lg:h-[calc(100vh-1.5rem)] lg:w-64 lg:flex-none lg:flex-col lg:rounded-2xl lg:border lg:border-panel-border lg:bg-panel lg:px-3 lg:py-5 lg:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_16px_32px_-12px_rgba(0,0,0,0.14)]">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <Skeleton className="h-[30px] w-[30px] rounded-lg" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="mb-2 ml-2.5 h-2.5 w-10" />
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-lg" />
        ))}
      </div>

      <Skeleton className="mt-6 mb-2 ml-2.5 h-2.5 w-14" />
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-lg" />
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-1.5 border-t border-panel-border pt-3">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-8 rounded-lg" />
        <Skeleton className="h-8 rounded-lg" />
      </div>
    </aside>
  );
}
