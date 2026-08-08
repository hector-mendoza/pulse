import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/icons";

export function StatsGrid({ stats }) {
  const cards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      caption: "Connected to Vercel",
      icon: "Folder",
      dark: true,
    },
    {
      label: "Deploys Today",
      value: stats.deploysToday,
      caption: "Across all projects",
      icon: "Rocket",
      badge: "bg-blue-500/12 text-blue-600",
    },
    {
      label: "Ready",
      value: stats.ready,
      caption: "In the last 10 deploys",
      icon: "Zap",
      accent: "text-status-ready",
      badge: "bg-status-ready/12 text-status-ready",
    },
    {
      label: "Errors",
      value: stats.errors,
      caption: "Need attention",
      icon: "TrendingUp",
      accent: stats.errors > 0 ? "text-status-error" : undefined,
      badge: "bg-status-error/12 text-status-error",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-5 lg:grid-cols-4 lg:px-0">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "card-shadow flex flex-col justify-between rounded-2xl p-4",
            card.dark
              ? "bg-primary text-primary-foreground"
              : "border border-panel-border bg-panel"
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-[12.5px] font-medium",
                card.dark ? "text-primary-foreground/70" : "text-text-dim"
              )}
            >
              {card.label}
            </span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                card.dark
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : card.badge
              )}
            >
              <NavIcon name={card.icon} size={14} />
            </span>
          </div>
          <div
            className={cn(
              "mt-4 font-mono text-[26px] font-semibold",
              card.accent
            )}
          >
            {card.value}
          </div>
          <div
            className={cn(
              "mt-1 text-[11px]",
              card.dark ? "text-primary-foreground/50" : "text-text-faint"
            )}
          >
            {card.caption}
          </div>
        </div>
      ))}
    </div>
  );
}
