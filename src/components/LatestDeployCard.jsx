import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/icons";

const STATUS_BADGE = {
  ready: "bg-status-ready/12 text-status-ready",
  building: "bg-status-building/12 text-status-building",
  error: "bg-status-error/12 text-status-error",
  queued: "bg-status-queued/15 text-status-queued",
};

export function LatestDeployCard({ deploy }) {
  if (!deploy) {
    return (
      <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
        <div className="mb-3 text-[13.5px] font-semibold">Latest Deploy</div>
        <p className="text-[12.5px] text-text-faint">No deployments yet.</p>
      </div>
    );
  }

  return (
    <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[13.5px] font-semibold">Latest Deploy</div>
        <Badge
          className={cn(
            "rounded-md font-mono text-[10px] font-semibold tracking-wide",
            STATUS_BADGE[deploy.status]
          )}
        >
          {deploy.status.toUpperCase()}
        </Badge>
      </div>
      <p className="text-[13px] font-medium leading-snug">{deploy.message}</p>
      <p className="mt-1.5 font-mono text-[11.5px] text-text-faint">
        {deploy.project} · {deploy.commit} · {deploy.time}
      </p>

      {deploy.url ? (
        <a
          href={deploy.url}
          target="_blank"
          rel="noreferrer"
          className="pressable mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-[12.5px] font-semibold text-primary-foreground"
        >
          View Deployment
          <NavIcon name="ExternalLink" size={13} />
        </a>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-panel-border px-3 py-2.5 text-center text-[11.5px] text-text-faint">
          Sample data — connect Vercel to view real deploys
        </div>
      )}
    </div>
  );
}
