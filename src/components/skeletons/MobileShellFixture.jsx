"use client";

import { Suspense } from "react";
import { NavProvider } from "@/components/NavProvider";
import { AppHeader } from "@/components/AppHeader";
import { DashboardContent } from "@/components/DashboardContent";
import { TabBar } from "@/components/TabBar";
import { projects as mockProjects, hydrateMockDeployments } from "@/lib/mock-data";
import {
  computeStats,
  computeWeeklyActivity,
  computeSuccessBreakdown,
  latestDeployment,
} from "@/lib/dashboard-stats";

function MobileShellInner() {
  const projects = mockProjects.filter((p) => p.id !== "all");
  const deployments = hydrateMockDeployments();
  const stats = computeStats(projects, deployments);
  const weeklyActivity = computeWeeklyActivity(deployments);
  const successBreakdown = computeSuccessBreakdown(deployments);
  const latestDeploy = latestDeployment(deployments);

  return (
    <>
      <div className="mx-auto w-full max-w-[480px] pb-[calc(env(safe-area-inset-bottom)+96px)]">
        <AppHeader
          projectsCount={projects.length}
          userEmail="dev@pulse.app"
          userName="Pulse"
        />
        <DashboardContent
          projects={projects}
          deployments={deployments}
          stats={stats}
          weeklyActivity={weeklyActivity}
          successBreakdown={successBreakdown}
          latestDeploy={latestDeploy}
          hasVercelToken={true}
          vercelToken="fixture"
          vercelError={null}
        />
      </div>
      <TabBar />
    </>
  );
}

/** Static mobile shell used by the boneyard CLI to capture bone positions. */
export function MobileShellFixture() {
  return (
    <Suspense>
      <NavProvider>
        <MobileShellInner />
      </NavProvider>
    </Suspense>
  );
}
