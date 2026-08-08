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

const EMPTY_STATES = {
  domains: {
    icon: "◐",
    title: "Domains coming soon",
    description:
      "Manage domains and certificates for your connected projects, right from here.",
  },
};

export function DashboardContent({
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
            icon="◧"
            title="Connect Vercel for analytics"
            description="Analytics data comes straight from your Vercel projects — connect your account in Settings first."
          />
        )}
      </div>
    );
  }

  if (active !== "deploys") {
    const state = EMPTY_STATES[active];
    return (
      <div className="lg:mx-auto lg:max-w-5xl lg:px-8 lg:py-8">
        <EmptyState {...state} />
      </div>
    );
  }

  return (
    <div className="lg:mx-auto lg:max-w-6xl lg:px-8 lg:py-8">
      <div className="mb-5 hidden items-center justify-between lg:flex">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-[13px] text-text-dim">
            Monitor your Vercel projects and deployments at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-panel-border bg-panel px-3.5 py-2 text-[12.5px] font-semibold text-foreground"
          >
            View on Vercel
            <NavIcon name="ExternalLink" size={14} />
          </a>
        </div>
      </div>

      {!hasVercelToken && (
        <div className="mx-5 mb-5 flex items-center justify-between gap-3 rounded-xl border border-dashed border-panel-border bg-panel px-3.5 py-3 text-[12.5px] text-text-dim lg:mx-0">
          <span>Showing sample data.</span>
          <button
            type="button"
            onClick={() => setActive("settings")}
            className="font-medium text-primary"
          >
            Connect Vercel →
          </button>
        </div>
      )}

      {vercelError && (
        <div className="mx-5 mb-5 rounded-xl border border-status-error/30 bg-status-error/8 px-3.5 py-3 text-[12.5px] text-status-error lg:mx-0">
          Couldn&apos;t load Vercel data: {vercelError}
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
            <a className="font-mono text-xs text-text-faint" href="#">
              view all →
            </a>
          </div>
          <DeployTimeline deployments={deployments} />
        </div>

        {!hasVercelToken && (
          <div className="mb-6 rounded-xl border border-dashed border-status-ready/35 bg-status-ready/6 p-3.5 text-xs leading-relaxed text-text-dim lg:hidden">
            <b className="text-status-ready">Prototype</b> — this is how it
            would look added to your iPhone home screen: its own icon,
            full-screen, no Safari bar.
          </div>
        )}
      </div>
    </div>
  );
}
