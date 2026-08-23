"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { StatusNode } from "@/components/StatusNode";
import { Sheet } from "@/components/Sheet";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";
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

const STATUS_COPY = {
  ready: "Deployed successfully.",
  building: "Build in progress.",
  error: "The build failed.",
  queued: "Waiting to build.",
};

export function DeployTimeline({ deployments }) {
  const [selected, setSelected] = useState(null);

  if (deployments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-panel-border px-4 py-8 text-center text-[13px] text-text-dim">
        No deployments yet.
      </div>
    );
  }

  return (
    <>
      <div>
        {deployments.map((deploy, i) => (
          <div
            key={deploy.id}
            className="relative flex gap-3.5 pb-[22px] last:pb-0"
          >
            <div className="relative flex w-3.5 flex-none justify-center">
              {i < deployments.length - 1 && (
                <div className="absolute top-4 -bottom-[22px] w-px bg-rail" />
              )}
              <StatusNode status={deploy.status} className="mt-[3px]" />
            </div>

            <button
              type="button"
              onClick={() => {
                haptic("select");
                setSelected(deploy);
              }}
              className="pressable card-shadow flex-1 rounded-xl border border-panel-border bg-panel p-3.5 text-left hover:border-primary/40"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="text-[13.5px] font-medium">{deploy.message}</div>
                <Badge
                  className={cn(
                    "flex-none rounded-md font-mono text-[10.5px] font-semibold tracking-wide",
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
            </button>
          </div>
        ))}
      </div>

      <Sheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.message}
        subtitle={selected ? `${selected.project} · ${selected.commit}` : undefined}
      >
        {selected && <DeployDetail deploy={selected} />}
      </Sheet>
    </>
  );
}

function DeployDetail({ deploy }) {
  const rows = [
    { label: "Project", value: deploy.project, mono: true },
    { label: "Commit", value: deploy.commit, mono: true },
    { label: "Deployed", value: deploy.time },
    deploy.timestamp && {
      label: "Timestamp",
      value: new Date(deploy.timestamp).toLocaleString(),
    },
    deploy.detail && { label: "Detail", value: deploy.detail },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[12.5px] font-medium",
          STATUS_BADGE[deploy.status]
        )}
      >
        <StatusNode status={deploy.status} className="bg-transparent" />
        {STATUS_COPY[deploy.status]}
      </div>

      <dl className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4"
          >
            <dt className="flex-none text-[12px] text-text-dim">{row.label}</dt>
            <dd
              className={cn(
                "truncate text-right text-[12.5px]",
                row.mono && "font-mono"
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {deploy.url ? (
        <a
          href={deploy.url}
          target="_blank"
          rel="noreferrer"
          className="pressable flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-[13px] font-semibold text-primary-foreground"
        >
          Open on Vercel
          <NavIcon name="ExternalLink" size={14} />
        </a>
      ) : (
        <p className="rounded-xl border border-dashed border-panel-border px-3 py-3 text-center text-[11.5px] text-text-faint">
          Sample data — connect Vercel to open real deployments.
        </p>
      )}
    </div>
  );
}
