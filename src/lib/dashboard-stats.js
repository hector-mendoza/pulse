const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function computeStats(projects, deployments) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return {
    totalProjects: projects.length,
    deploysToday: deployments.filter((d) => d.timestamp >= todayStart).length,
    ready: deployments.filter((d) => d.status === "ready").length,
    errors: deployments.filter((d) => d.status === "error").length,
  };
}

export function computeWeeklyActivity(deployments) {
  const now = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    days.push({
      label: DAY_LABELS[date.getDay()],
      count: deployments.filter((d) => d.timestamp >= dayStart && d.timestamp < dayEnd).length,
      isToday: i === 0,
    });
  }

  return days;
}

export function computeSuccessBreakdown(deployments) {
  const total = deployments.length;
  const counts = { ready: 0, building: 0, error: 0, queued: 0 };

  deployments.forEach((d) => {
    if (counts[d.status] !== undefined) counts[d.status] += 1;
  });

  return {
    total,
    counts,
    readyPct: total === 0 ? 0 : Math.round((counts.ready / total) * 100),
  };
}

export function latestDeployment(deployments) {
  return deployments[0] ?? null;
}
