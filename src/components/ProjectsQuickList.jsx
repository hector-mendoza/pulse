"use client";

import Link from "next/link";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";

const ICON_COLORS = [
  "bg-blue-500/12 text-blue-600",
  "bg-amber-500/12 text-amber-600",
  "bg-status-ready/12 text-status-ready",
  "bg-violet-500/12 text-violet-600",
  "bg-status-error/12 text-status-error",
];

export function ProjectsQuickList({ projects, deployments }) {
  const lastDeployByProject = new Map();
  deployments.forEach((d) => {
    if (!lastDeployByProject.has(d.project)) {
      lastDeployByProject.set(d.project, d.time);
    }
  });

  return (
    <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[13.5px] font-semibold">Projects</div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
          {projects.length}
        </span>
      </div>

      {projects.length === 0 && (
        <p className="text-[12.5px] text-text-faint">No projects yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {projects.slice(0, 6).map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            transitionTypes={["nav-forward"]}
            onClick={() => haptic("select")}
            className="pressable -mx-1.5 flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-accent"
          >
            <span
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${ICON_COLORS[i % ICON_COLORS.length]}`}
            >
              <NavIcon name="Folder" size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium">
                {project.name}
              </div>
              <div className="text-[11px] text-text-faint">
                {lastDeployByProject.get(project.name) || "No deploys yet"}
              </div>
            </div>
            <NavIcon
              name="ChevronRight"
              size={14}
              className="flex-none text-text-faint"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
