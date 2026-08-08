export function WeeklyActivity({ days }) {
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
      <div className="mb-4 text-[13.5px] font-semibold">Deploy Activity</div>
      <div className="flex items-end justify-between gap-2 px-1">
        {days.map((day, i) => {
          const heightPct = Math.max(8, (day.count / max) * 100);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-24 w-full items-end justify-center">
                {day.isToday && day.count > 0 && (
                  <span className="absolute -top-6 rounded-md bg-primary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground">
                    {day.count}
                  </span>
                )}
                <div
                  className="w-full max-w-[18px] rounded-full"
                  style={{
                    height: `${heightPct}%`,
                    background:
                      day.count === 0
                        ? "repeating-linear-gradient(135deg, var(--border), var(--border) 2px, transparent 2px, transparent 4px)"
                        : day.isToday
                          ? "var(--brand)"
                          : "var(--primary)",
                    opacity: day.count === 0 ? 1 : day.isToday ? 1 : 0.55,
                  }}
                />
              </div>
              <span
                className={
                  day.isToday
                    ? "text-[11px] font-semibold text-foreground"
                    : "text-[11px] text-text-faint"
                }
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
