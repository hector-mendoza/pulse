import { cn } from "@/lib/utils";

const STATUS_BORDER = {
  ready: "border-status-ready",
  building: "border-status-building",
  error: "border-status-error",
  queued: "border-status-queued",
};

export function StatusNode({ status }) {
  return (
    <div
      className={cn(
        "mt-[3px] h-3.5 w-3.5 flex-none rounded-full border-2 bg-panel",
        STATUS_BORDER[status],
        status === "building" && "animate-status-pulse"
      )}
    />
  );
}
