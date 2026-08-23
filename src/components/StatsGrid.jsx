import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/icons";

export function StatsGrid({ stats }) {
  const cards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      caption: "Connected to Vercel",
      icon: "Folder",
      feature: true,
    },
    {
      label: "Deploys Today",
      value: stats.deploysToday,
      caption: "Across all projects",
      icon: "Rocket",
      badge: "bg-accent text-accent-foreground",
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
      icon: stats.errors > 0 ? "TriangleAlert" : "CheckCheck",
      accent: stats.errors > 0 ? "text-status-error" : undefined,
      badge:
        stats.errors > 0
          ? "bg-status-error/12 text-status-error"
          : "bg-status-queued/12 text-status-queued",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-5 lg:grid-cols-4 lg:px-0">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "card-shadow flex flex-col justify-between rounded-2xl p-4",
            card.feature
              ? // The lead card carries the accent so the palette choice is
                // visible the moment the dashboard opens.
                "bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_82%,var(--foreground))] text-primary-foreground"
              : "border border-panel-border bg-panel"
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-[12.5px] font-medium whitespace-nowrap",
                card.feature ? "text-primary-foreground/75" : "text-text-dim"
              )}
            >
              {card.label}
            </span>
            <span
              className={cn(
                "flex h-7 w-7 flex-none items-center justify-center rounded-full",
                card.feature
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : card.badge
              )}
            >
              <NavIcon name={card.icon} size={14} />
            </span>
          </div>
          <div
            className={cn(
              "tabular mt-4 font-mono text-[26px] font-semibold",
              card.accent
            )}
          >
            {card.value}
          </div>
          <div
            className={cn(
              "mt-1 text-[11px]",
              card.feature ? "text-primary-foreground/55" : "text-text-faint"
            )}
          >
            {card.caption}
          </div>
        </div>
      ))}
    </div>
  );
}
