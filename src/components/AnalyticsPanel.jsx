"use client";

import { useEffect, useState } from "react";
import { NavIcon } from "@/components/icons";
import { EmptyState } from "@/components/EmptyState";
import { AnalyticsSkeleton } from "@/components/skeletons/AnalyticsSkeleton";
import { cn } from "@/lib/utils";

export function AnalyticsPanel({ projects }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? null);
  const [state, setState] = useState({
    forId: null,
    status: "idle",
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;

    fetch(`/api/analytics?projectId=${encodeURIComponent(selectedId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setState({ forId: selectedId, status: "error", data: null, error: json.error });
        } else {
          setState({ forId: selectedId, status: "ready", data: json, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ forId: selectedId, status: "error", data: null, error: "Network error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const isLoading = state.forId !== selectedId;

  if (projects.length === 0) {
    return (
      <EmptyState
        icon="Folder"
        title="No projects yet"
        description="Connect Vercel and deploy a project to see analytics here."
      />
    );
  }

  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <div className="mx-5 flex flex-col gap-4 lg:mx-0">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelectedId(project.id)}
            className={cn(
              "flex-none whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[13px] font-medium text-text-dim",
              "border-panel-border bg-panel",
              selectedId === project.id &&
                "border-primary bg-primary font-semibold text-primary-foreground"
            )}
          >
            {project.name}
          </button>
        ))}
      </div>

      {isLoading && <AnalyticsSkeleton />}

      {!isLoading && state.status === "error" && (
        <div className="rounded-2xl border border-status-error/30 bg-status-error/8 p-5 text-[13px] text-status-error">
          Couldn&apos;t load analytics: {state.error}
        </div>
      )}

      {!isLoading && state.status === "ready" && state.data && !state.data.enabled && (
        <EmptyState
          icon="ChartColumn"
          title="Web Analytics isn't enabled"
          description={`Turn on Web Analytics for ${selectedProject?.name ?? "this project"} in the Vercel dashboard to see visits and top pages here.`}
        />
      )}

      {!isLoading && state.status === "ready" && state.data?.enabled && (
        <AnalyticsData data={state.data} />
      )}
    </div>
  );
}

function AnalyticsData({ data }) {
  const maxTrend = Math.max(1, ...data.trend.map((d) => d.pageviews));

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-text-dim">
              Visitors
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
              <NavIcon name="Users" size={14} />
            </span>
          </div>
          <div className="mt-4 font-mono text-[26px] font-semibold">
            {data.visitors.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-text-faint">Last 7 days</div>
        </div>

        <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-text-dim">
              Pageviews
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
              <NavIcon name="TrendingUp" size={14} />
            </span>
          </div>
          <div className="mt-4 font-mono text-[26px] font-semibold">
            {data.pageviews.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-text-faint">Last 7 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
          <div className="mb-4 text-[13.5px] font-semibold">
            Pageviews Trend
          </div>
          {data.trend.length === 0 ? (
            <p className="text-[12.5px] text-text-faint">No data yet.</p>
          ) : (
            <div className="flex items-end justify-between gap-2 px-1">
              {data.trend.map((point, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-24 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[18px] rounded-full bg-primary"
                      style={{
                        height: `${Math.max(6, (point.pageviews / maxTrend) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-text-faint">
                    {new Date(point.day).toLocaleDateString(undefined, {
                      weekday: "narrow",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
          <div className="mb-3 text-[13.5px] font-semibold">Top Pages</div>
          {data.topPages.length === 0 ? (
            <p className="text-[12.5px] text-text-faint">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {data.topPages.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate font-mono text-[12px] text-text-dim">
                    {page.path}
                  </span>
                  <span className="flex-none font-mono text-[12px] text-text-faint">
                    {page.pageviews.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
