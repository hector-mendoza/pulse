import { Badge } from "@/components/ui/badge";
import { StatusNode } from "@/components/StatusNode";
import { cn } from "@/lib/utils";

const STATUS_LABEL = {
  ready: "READY",
  building: "BUILDING",
  error: "ERROR",
  queued: "QUEUED",
};

const STATUS_BADGE = {
  ready: "bg-status-ready/12 text-status-ready",
  building: "bg-status-building/12 text-status-building",
  error: "bg-status-error/12 text-status-error",
  queued: "bg-status-queued/15 text-status-queued",
};

export function DeployTimeline({ deployments }) {
  if (deployments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-panel-border px-4 py-8 text-center text-[13px] text-text-dim">
        No deployments yet.
      </div>
    );
  }

  return (
    <div>
      {deployments.map((deploy, i) => (
        <div key={deploy.id} className="relative flex gap-3.5 pb-[22px] last:pb-0">
          <div className="relative flex w-3.5 flex-none justify-center">
            {i < deployments.length - 1 && (
              <div className="absolute top-4 -bottom-[22px] w-px bg-rail" />
            )}
            <StatusNode status={deploy.status} />
          </div>

          {deploy.url ? (
            <a
              href={deploy.url}
              target="_blank"
              rel="noreferrer"
              className="card-shadow flex-1 rounded-xl border border-panel-border bg-panel p-3.5 transition-colors hover:border-primary/40"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="text-[13.5px] font-medium">{deploy.message}</div>
                <Badge
                  className={cn(
                    "rounded-md font-mono text-[10.5px] font-semibold tracking-wide",
                    STATUS_BADGE[deploy.status]
                  )}
                >
                  {STATUS_LABEL[deploy.status]}
                </Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="font-mono text-[11.5px] text-text-faint">
                  {deploy.project} ·{" "}
                  <span className="text-text-dim">{deploy.commit}</span> ·{" "}
                  {deploy.time}
                  {deploy.detail && ` · ${deploy.detail}`}
                </span>
              </div>
            </a>
          ) : (
            <div className="card-shadow flex-1 rounded-xl border border-panel-border bg-panel p-3.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="text-[13.5px] font-medium">{deploy.message}</div>
                <Badge
                  className={cn(
                    "rounded-md font-mono text-[10.5px] font-semibold tracking-wide",
                    STATUS_BADGE[deploy.status]
                  )}
                >
                  {STATUS_LABEL[deploy.status]}
                </Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="font-mono text-[11.5px] text-text-faint">
                  {deploy.project} ·{" "}
                  <span className="text-text-dim">{deploy.commit}</span> ·{" "}
                  {deploy.time}
                  {deploy.detail && ` · ${deploy.detail}`}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
