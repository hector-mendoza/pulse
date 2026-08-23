"use client";

import Link from "next/link";
import { haptic } from "@/lib/haptics";

export function ProjectPills({ projects }) {
  return (
    // `data-swipe-ignore` keeps a horizontal drag here from also changing tab.
    <div
      data-swipe-ignore
      className="no-scrollbar edge-fade-x flex gap-2 overflow-x-auto px-5 pb-5 lg:hidden"
    >
      <span className="flex-none rounded-full border border-primary bg-primary px-3.5 py-1.5 font-mono text-[13px] font-semibold whitespace-nowrap text-primary-foreground">
        All
      </span>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          transitionTypes={["nav-forward"]}
          onClick={() => haptic("select")}
          className="pressable flex-none rounded-full border border-panel-border bg-panel px-3.5 py-1.5 font-mono text-[13px] font-medium whitespace-nowrap text-text-dim"
        >
          {project.name}
        </Link>
      ))}
    </div>
  );
}
