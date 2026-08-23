import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { NavProvider } from "@/components/NavProvider";
import { Sidebar } from "@/components/Sidebar";
import { ProjectDetailHeader } from "@/components/ProjectDetailHeader";
import { DeploySuccessDonut } from "@/components/DeploySuccessDonut";
import { DeployTimeline } from "@/components/DeployTimeline";
import { WeeklyActivity } from "@/components/WeeklyActivity";
import { LatestDeployCard } from "@/components/LatestDeployCard";
import { getUserContext, getDecryptedVercelToken } from "@/lib/user-context";
import {
  listVercelProjects,
  listVercelDeployments,
  formatRelativeTime,
  VercelApiError,
} from "@/lib/vercel-api";
import {
  computeSuccessBreakdown,
  computeWeeklyActivity,
  latestDeployment,
} from "@/lib/dashboard-stats";
import {
  projects as mockProjects,
  deployments as mockDeployments,
} from "@/lib/mock-data";

function hydrateMockDeployments() {
  const now = Date.now();
  return mockDeployments.map((d) => {
    const timestamp = now - d.offsetMs;
    return { ...d, timestamp, time: formatRelativeTime(timestamp), url: null };
  });
}

async function getProjectData(id) {
  const { user, userEmail, userName, vercelToken } = await getUserContext();
  const identity = { userEmail, userName };

  if (!vercelToken) {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) return null;

    const deployments = hydrateMockDeployments().filter(
      (d) => d.project === project.name,
    );

    return {
      ...identity,
      project,
      allProjects: mockProjects.filter((p) => p.id !== "all"),
      deployments,
      hasVercelToken: false,
      vercelError: null,
    };
  }

  try {
    const token = await getDecryptedVercelToken(user.id);
    const [allProjects, deployments] = await Promise.all([
      listVercelProjects(token),
      listVercelDeployments(token, { projectId: id, limit: 20 }),
    ]);

    const project = allProjects.find((p) => p.id === id);
    if (!project) return null;

    return {
      ...identity,
      project,
      allProjects,
      deployments,
      hasVercelToken: true,
      vercelError: null,
    };
  } catch (err) {
    return {
      ...identity,
      project: { id, name: id },
      allProjects: [],
      deployments: [],
      hasVercelToken: true,
      vercelError:
        err instanceof VercelApiError ? err.message : "Unexpected error.",
    };
  }
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const data = await getProjectData(id);

  if (!data) notFound();

  const successBreakdown = computeSuccessBreakdown(data.deployments);
  const weeklyActivity = computeWeeklyActivity(data.deployments);
  const latestDeploy = latestDeployment(data.deployments);

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <NavProvider>
        <div className="lg:flex lg:min-h-screen lg:gap-3">
          <Sidebar
            projects={data.allProjects}
            hasVercelToken={data.hasVercelToken}
            userEmail={data.userEmail}
            userName={data.userName}
          />

          <div className="mx-auto w-full max-w-[480px] pb-[calc(env(safe-area-inset-bottom)+2rem)] lg:max-w-none lg:flex-1">
            <ProjectDetailHeader
              project={data.project}
              deployCount={data.deployments.length}
            />

            <div className="flex flex-col gap-4 px-5 py-5 lg:mx-auto lg:max-w-5xl lg:px-8 lg:py-8">
              {data.vercelError && (
                <div className="rounded-xl border border-status-error/30 bg-status-error/8 px-3.5 py-3 text-[12.5px] text-status-error">
                  Couldn&apos;t load Vercel data: {data.vercelError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <WeeklyActivity days={weeklyActivity} />
                <LatestDeployCard deploy={latestDeploy} />
                <DeploySuccessDonut breakdown={successBreakdown} />
              </div>

              <div>
                <div className="mb-3.5 flex items-baseline justify-between">
                  <h2 className="text-[13px] font-semibold tracking-wide text-text-dim uppercase">
                    Deployments
                  </h2>
                </div>
                <DeployTimeline deployments={data.deployments} />
              </div>
            </div>
          </div>
        </div>
      </NavProvider>
    </ViewTransition>
  );
}
