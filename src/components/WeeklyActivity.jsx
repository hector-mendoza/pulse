export function WeeklyActivity({ days }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[13.5px] font-semibold">Deploy Activity</div>
        <div className="tabular font-mono text-[11px] text-text-faint">
          {total} this week
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 px-1 pt-7">
        {days.map((day, i) => {
          const heightPct = Math.max(8, (day.count / max) * 100);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-24 w-full items-end justify-center">
                {day.isToday && day.count > 0 && (
                  <span className="tabular absolute -top-6 rounded-md bg-primary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground">
                    {day.count}
                  </span>
                )}
                <div
                  className="w-full max-w-[18px] rounded-full"
                  style={{
                    height: `${heightPct}%`,
                    // Bars grow from the baseline on first paint so the chart
                    // reads as data arriving, not as a static image.
                    animation: `rise-in var(--dur-slow) var(--ease-out-quint) ${i * 40}ms both`,
                    transformOrigin: "bottom",
                    background:
                      day.count === 0
                        ? "repeating-linear-gradient(135deg, var(--rail), var(--rail) 2px, transparent 2px, transparent 4px)"
                        : day.isToday
                          ? "var(--primary)"
                          : "color-mix(in oklab, var(--primary) 55%, var(--panel))",
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
