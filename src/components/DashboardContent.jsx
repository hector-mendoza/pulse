"use client";

import { ProjectPills } from "@/components/ProjectPills";
import { StatsGrid } from "@/components/StatsGrid";
import { WeeklyActivity } from "@/components/WeeklyActivity";
import { DeploySuccessDonut } from "@/components/DeploySuccessDonut";
import { LatestDeployCard } from "@/components/LatestDeployCard";
import { ProjectsQuickList } from "@/components/ProjectsQuickList";
import { DeployTimeline } from "@/components/DeployTimeline";
import { EmptyState } from "@/components/EmptyState";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { NavIcon } from "@/components/icons";
import { useNav } from "@/components/NavProvider";
import { useSwipe } from "@/lib/use-swipe";
import { cn } from "@/lib/utils";

export function DashboardContent(props) {
  const { active, direction, shiftActive } = useNav();

  const { offset, handlers } = useSwipe({
    onSwipeLeft: () => shiftActive(1),
    onSwipeRight: () => shiftActive(-1),
  });

  return (
    <div {...handlers}>
      {/* Drag layer: follows the finger with resistance. Kept separate from
          the animation layer below because a running CSS animation outranks
          inline styles and would swallow the drag transform. */}
      <div
        style={{
          transform: offset ? `translateX(${offset}px)` : undefined,
          transition: offset ? "none" : "transform 280ms var(--ease-out-quint)",
        }}
      >
        {/* Re-keying on the active tab replays the enter animation, and the
            direction makes the pane arrive from the side it was pulled in. */}
        <div
          key={active}
          className={direction.current === "back" ? "pane-back" : "pane-forward"}
        >
          <Pane {...props} />
        </div>
      </div>
    </div>
  );
}

function Pane({
  projects,
  deployments,
  stats,
  weeklyActivity,
  successBreakdown,
  latestDeploy,
  hasVercelToken,
  vercelToken,
  vercelError,
}) {
  const { active, setActive } = useNav();

  if (active === "settings") {
    return (
      <div className="lg:mx-auto lg:max-w-3xl lg:px-8 lg:py-8">
        <SettingsPanel vercelToken={vercelToken} />
      </div>
    );
  }

  if (active === "analytics") {
    return (
      <div className="lg:mx-auto lg:max-w-5xl lg:px-8 lg:py-8">
        {hasVercelToken ? (
          <AnalyticsPanel projects={projects} />
        ) : (
          <EmptyState
            icon="ChartColumn"
            title="Connect Vercel for analytics"
            description="Analytics data comes straight from your Vercel projects — connect your account in Settings first."
            action={{ label: "Open settings", onClick: () => setActive("settings") }}
          />
        )}
      </div>
    );
  }

  if (active === "domains") {
    return (
      <div className="lg:mx-auto lg:max-w-5xl lg:px-8 lg:py-8">
        <EmptyState
          icon="Globe"
          title="Domains coming soon"
          description="Manage domains and certificates for your connected projects, right from here."
        />
      </div>
    );
  }

  return (
    <div className="lg:mx-auto lg:max-w-6xl lg:px-8 lg:py-8">
      <div className="mb-5 hidden items-center justify-between lg:flex">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-[13px] text-text-dim">
            Monitor your Vercel projects and deployments at a glance.
          </p>
        </div>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="pressable flex items-center gap-1.5 rounded-lg border border-panel-border bg-panel px-3.5 py-2 text-[12.5px] font-semibold text-foreground"
        >
          View on Vercel
          <NavIcon name="ExternalLink" size={14} />
        </a>
      </div>

      {!hasVercelToken && (
        <div className="mx-5 mb-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-panel-border bg-panel px-3.5 py-3 text-[12.5px] text-text-dim lg:mx-0">
          <span>Showing sample data.</span>
          <button
            type="button"
            onClick={() => setActive("settings")}
            className="pressable-sm flex items-center gap-1 font-semibold text-primary"
          >
            Connect Vercel
            <NavIcon name="ChevronRight" size={13} />
          </button>
        </div>
      )}

      {vercelError && (
        <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-status-error/30 bg-status-error/8 px-3.5 py-3 text-[12.5px] text-status-error lg:mx-0">
          <NavIcon name="TriangleAlert" size={14} className="mt-px flex-none" />
          <span>Couldn&apos;t load Vercel data: {vercelError}</span>
        </div>
      )}

      <ProjectPills projects={projects} />

      <div className="flex flex-col gap-4 px-5 lg:px-0">
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <WeeklyActivity days={weeklyActivity} />
          <LatestDeployCard deploy={latestDeploy} />
          <ProjectsQuickList projects={projects} deployments={deployments} />
        </div>

        <div className="lg:max-w-sm">
          <DeploySuccessDonut breakdown={successBreakdown} />
        </div>

        <div>
          <div className="mb-3.5 flex items-baseline justify-between">
            <h2 className="text-[13px] font-semibold tracking-wide text-text-dim uppercase">
              Recent activity
            </h2>
            <span className="font-mono text-xs text-text-faint">
              last {deployments.length}
            </span>
          </div>
          <DeployTimeline deployments={deployments} />
        </div>

        {!hasVercelToken && (
          <div
            className={cn(
              "mb-6 rounded-xl border border-dashed border-status-ready/35 bg-status-ready/6",
              "p-3.5 text-xs leading-relaxed text-text-dim lg:hidden"
            )}
          >
            <b className="text-status-ready">Prototype</b> — this is how it would
            look added to your iPhone home screen: its own icon, full-screen, no
            Safari bar.
          </div>
        )}
      </div>
    </div>
  );
}
