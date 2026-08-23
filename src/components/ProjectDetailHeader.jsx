"use client";

import Link from "next/link";
import { NavIcon } from "@/components/icons";
import { haptic } from "@/lib/haptics";

export function ProjectDetailHeader({ project, deployCount }) {
  return (
    <div className="sticky top-0 z-20 glass border-b border-panel-border px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-4 lg:static lg:mx-3 lg:mt-3 lg:rounded-2xl lg:border lg:bg-panel lg:px-6 lg:py-5 lg:backdrop-blur-none card-shadow">
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        onClick={() => haptic("select")}
        className="pressable-sm mb-2.5 inline-flex items-center gap-1 text-[12.5px] font-medium text-text-dim hover:text-foreground"
      >
        <NavIcon name="ArrowLeft" size={14} />
        Dashboard
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-mono text-[20px] font-semibold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-text-dim">
            {deployCount} deployment{deployCount === 1 ? "" : "s"}
          </p>
        </div>
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <NavIcon name="Folder" size={18} />
        </span>
      </div>
    </div>
  );
}
