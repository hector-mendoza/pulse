import { ViewTransition } from "react";
import { NavProvider } from "@/components/NavProvider";
import { Sidebar } from "@/components/Sidebar";
import { AppHeader } from "@/components/AppHeader";
import { DesktopTopbar } from "@/components/DesktopTopbar";
import { DashboardContent } from "@/components/DashboardContent";
import { TabBar } from "@/components/TabBar";
import { PullToRefresh } from "@/components/PullToRefresh";
import { getUserContext, getDecryptedVercelToken } from "@/lib/user-context";
import {
  listVercelProjects,
  listVercelDeployments,
  formatRelativeTime,
  VercelApiError,
} from "@/lib/vercel-api";
import {
  computeStats,
  computeWeeklyActivity,
  computeSuccessBreakdown,
  latestDeployment,
} from "@/lib/dashboard-stats";
import { projects as mockProjects, deployments as mockDeployments } from "@/lib/mock-data";

function hydrateMockDeployments() {
  const now = Date.now();
  return mockDeployments.map((d) => {
    const timestamp = now - d.offsetMs;
    return { ...d, timestamp, time: formatRelativeTime(timestamp), url: null };
  });
}

async function getDashboardData() {
  const { user, userEmail, userName, vercelToken } = await getUserContext();
  const identity = { userEmail, userName };

  if (!vercelToken) {
    const deployments = hydrateMockDeployments();
    return {
      ...identity,
      projects: mockProjects.filter((p) => p.id !== "all"),
      deployments,
      hasVercelToken: false,
      vercelToken: null,
      vercelError: null,
    };
  }

  try {
    const token = await getDecryptedVercelToken(user.id);
    const [projects, deployments] = await Promise.all([
      listVercelProjects(token),
      listVercelDeployments(token),
    ]);

    return {
      ...identity,
      projects,
      deployments,
      hasVercelToken: true,
      vercelToken,
      vercelError: null,
    };
  } catch (err) {
    return {
      ...identity,
      projects: [],
      deployments: [],
      hasVercelToken: true,
      vercelToken,
      vercelError: err instanceof VercelApiError ? err.message : "Unexpected error.",
    };
  }
}

export default async function Home() {
  const data = await getDashboardData();

  const stats = computeStats(data.projects, data.deployments);
  const weeklyActivity = computeWeeklyActivity(data.deployments);
  const successBreakdown = computeSuccessBreakdown(data.deployments);
  const latestDeploy = latestDeployment(data.deployments);

  return (
    // Directional slides make a push into a project feel like moving forward
    // and the back link feel like returning. Untyped navigations (browser
    // back, refresh) fall through to no animation.
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
            projects={data.projects}
            hasVercelToken={data.hasVercelToken}
            userEmail={data.userEmail}
            userName={data.userName}
          />

          <div className="mx-auto w-full max-w-[480px] pb-[calc(env(safe-area-inset-bottom)+84px)] lg:max-w-none lg:flex-1 lg:pb-0">
            <AppHeader
              projectsCount={data.projects.length}
              userEmail={data.userEmail}
              userName={data.userName}
            />
            <DesktopTopbar projects={data.projects} />
            <PullToRefresh>
              <DashboardContent
                {...data}
                stats={stats}
                weeklyActivity={weeklyActivity}
                successBreakdown={successBreakdown}
                latestDeploy={latestDeploy}
              />
            </PullToRefresh>
          </div>
        </div>

        <TabBar />
      </NavProvider>
    </ViewTransition>
  );
}
