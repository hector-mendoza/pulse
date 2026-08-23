"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useNav } from "@/components/NavProvider";
import { NavIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { avatarUrl } from "@/lib/avatar";

const GENERAL_ITEMS = [
  { id: "help", icon: "Info", label: "Help" },
];

export function Sidebar({ projects, hasVercelToken, userEmail, userName }) {
  const { active, setActive } = useNav();
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <aside className="hidden lg:sticky lg:top-3 lg:my-3 lg:ml-3 lg:flex lg:h-[calc(100vh-1.5rem)] lg:w-64 lg:flex-none lg:flex-col lg:rounded-2xl lg:border lg:border-panel-border lg:bg-panel lg:px-3 lg:py-5 lg:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_16px_32px_-12px_rgba(0,0,0,0.14)]">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="brand-mark flex h-[30px] w-[30px] items-center justify-center rounded-[10px] font-mono text-sm font-bold">
          ▲
        </div>
        <h1 className="text-[16px] font-semibold tracking-tight">Pulse</h1>
      </div>

      <div className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-wide text-text-faint uppercase">
        Menu
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = isDashboard && active === item.id;
          const className = cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-medium text-text-dim transition-colors hover:text-foreground",
            isActive && "bg-accent font-semibold text-primary"
          );

          if (isDashboard) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={className}
              >
                <NavIcon name={item.icon} size={17} />
                {item.label}
              </button>
            );
          }

          return (
            <Link key={item.id} href="/" className={className}>
              <NavIcon name={item.icon} size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 mb-1.5 px-2.5 text-[11px] font-semibold tracking-wide text-text-faint uppercase">
        Projects
      </div>
      <div className="flex flex-col gap-0.5 overflow-y-auto">
        {projects.length === 0 && (
          <p className="px-2.5 text-[12px] text-text-faint">
            No projects yet.
          </p>
        )}
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            transitionTypes={["nav-forward"]}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left font-mono text-[12.5px] text-text-dim transition-colors hover:bg-accent hover:text-foreground",
              pathname === `/projects/${project.id}` &&
                "bg-accent font-semibold text-primary"
            )}
          >
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-status-ready" />
            <span className="truncate">{project.name}</span>
          </Link>
        ))}
      </div>

      <div className="flex-1" />

      {!hasVercelToken && (
        <div className="mb-3 flex flex-col gap-3 rounded-2xl bg-primary p-4">
          <div>
            <div className="text-[13.5px] font-semibold text-primary-foreground">
              Connect Vercel
            </div>
            <div className="mt-1 text-[11.5px] leading-relaxed text-primary-foreground/60">
              See your real projects and deployments here.
            </div>
          </div>
          {isDashboard ? (
            <button
              type="button"
              onClick={() => setActive("settings")}
              className="pressable flex items-center justify-center gap-1.5 rounded-lg bg-primary-foreground px-3 py-2 text-[12.5px] font-semibold text-primary"
            >
              Connect
            </button>
          ) : (
            <Link
              href="/"
              className="pressable flex items-center justify-center gap-1.5 rounded-lg bg-primary-foreground px-3 py-2 text-[12.5px] font-semibold text-primary"
            >
              Connect
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col gap-0.5 border-t border-panel-border pt-3">
        <div className="mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5">
          <Avatar className="h-8 w-8 flex-none border border-panel-border">
            <AvatarImage src={avatarUrl(userEmail || "pulse")} alt={userName} />
            <AvatarFallback className="bg-secondary text-[11px] text-secondary-foreground">
              {(userName || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium">
              {userName}
            </div>
            <div className="truncate text-[11px] text-text-faint">
              {userEmail}
            </div>
          </div>
        </div>

        {GENERAL_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-medium text-text-dim transition-colors hover:text-foreground"
          >
            <NavIcon name={item.icon} size={17} />
            {item.label}
          </button>
        ))}
        <ThemeToggle className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-medium text-text-dim transition-colors hover:text-foreground" />
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-medium text-text-dim transition-colors hover:text-destructive"
          >
            <NavIcon name="LogOut" size={17} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
