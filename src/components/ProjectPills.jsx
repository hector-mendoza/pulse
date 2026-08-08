"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function ProjectPills({ projects }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
      <span
        className={cn(
          "flex-none whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[13px] font-semibold",
          "border-primary bg-primary text-primary-foreground"
        )}
      >
        All
      </span>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="flex-none whitespace-nowrap rounded-full border border-panel-border bg-panel px-3.5 py-1.5 font-mono text-[13px] font-medium text-text-dim"
        >
          {project.name}
        </Link>
      ))}
    </div>
  );
}
