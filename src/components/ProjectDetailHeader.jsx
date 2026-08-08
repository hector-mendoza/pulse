import Link from "next/link";
import { NavIcon } from "@/components/icons";

export function ProjectDetailHeader({ project, deployCount }) {
  return (
    <div className="px-5 pt-6 pb-5 lg:mx-3 lg:mt-3 lg:rounded-2xl lg:border lg:border-panel-border lg:bg-panel lg:px-6 lg:py-5 lg:pt-5 card-shadow">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-text-dim hover:text-foreground"
      >
        <NavIcon name="ArrowLeft" size={14} />
        Back to dashboard
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
      </div>
    </div>
  );
}
