import "server-only";
import { formatRelativeTime } from "@/lib/format-relative-time";

const VERCEL_API = "https://api.vercel.com";

const STATE_TO_STATUS = {
  READY: "ready",
  ERROR: "error",
  CANCELED: "queued",
  QUEUED: "queued",
  BUILDING: "building",
  INITIALIZING: "building",
  DEPLOYING: "building",
};

class VercelApiError extends Error {}
class WebAnalyticsNotEnabledError extends Error {}

async function vercelFetch(token, path) {
  const res = await fetch(`${VERCEL_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (body?.error?.code === "not_found" && /web analytics/i.test(body?.error?.message || "")) {
      throw new WebAnalyticsNotEnabledError(body.error.message);
    }
    throw new VercelApiError(
      body?.error?.message || `Vercel API error (${res.status})`
    );
  }

  return res.json();
}

export async function verifyVercelToken(token) {
  await vercelFetch(token, "/v2/user");
}

export async function listVercelProjects(token, { limit = 20 } = {}) {
  const data = await vercelFetch(token, `/v9/projects?limit=${limit}`);
  return data.projects.map((project) => ({
    id: project.id,
    name: project.name,
  }));
}

export async function listVercelDeployments(token, { limit = 10, projectId } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (projectId) params.set("projectId", projectId);
  const data = await vercelFetch(token, `/v6/deployments?${params}`);

  return data.deployments.map((deployment) => ({
    id: deployment.uid,
    message:
      deployment.meta?.githubCommitMessage?.split("\n")[0] ||
      deployment.name,
    status: STATE_TO_STATUS[deployment.state] ?? "queued",
    project: deployment.name,
    commit: (deployment.meta?.githubCommitSha || deployment.uid).slice(0, 7),
    timestamp: deployment.created,
    time: formatRelativeTime(deployment.created),
    url: `https://vercel.com/deployments/${deployment.uid}`,
    detail:
      deployment.state === "ERROR" ? "build failed — check logs" : undefined,
  }));
}

export async function getWebAnalytics(token, { projectId, sinceDays = 7 } = {}) {
  const until = new Date();
  const since = new Date(until.getTime() - sinceDays * 24 * 60 * 60 * 1000);
  const range = `since=${since.toISOString()}&until=${until.toISOString()}`;

  try {
    const [summary, trend, topPages] = await Promise.all([
      vercelFetch(
        token,
        `/v1/query/web-analytics/visits/count?projectId=${projectId}&${range}`
      ),
      vercelFetch(
        token,
        `/v1/query/web-analytics/visits/aggregate?projectId=${projectId}&${range}&by=day`
      ),
      vercelFetch(
        token,
        `/v1/query/web-analytics/visits/aggregate?projectId=${projectId}&${range}&by=requestPath&limit=5`
      ),
    ]);

    return {
      enabled: true,
      pageviews: summary.data?.pageviews ?? 0,
      visitors: summary.data?.visitors ?? 0,
      trend: (trend.data ?? []).map((d) => ({
        day: d.timestamp,
        pageviews: d.pageviews ?? 0,
        visitors: d.visitors ?? 0,
      })),
      topPages: (topPages.data ?? []).map((d) => ({
        path: d.requestPath || "/",
        pageviews: d.pageviews ?? 0,
      })),
    };
  } catch (err) {
    if (err instanceof WebAnalyticsNotEnabledError) {
      return { enabled: false };
    }
    throw err;
  }
}

export { VercelApiError };
