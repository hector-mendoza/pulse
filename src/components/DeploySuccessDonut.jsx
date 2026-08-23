const SEGMENT_ORDER = [
  { key: "ready", label: "Ready", color: "var(--status-ready)" },
  { key: "building", label: "Building", color: "var(--status-building)" },
  { key: "error", label: "Error", color: "var(--status-error)" },
  { key: "queued", label: "Queued", color: "var(--status-queued)" },
];

export function DeploySuccessDonut({ breakdown }) {
  const { total, counts, readyPct } = breakdown;

  let cursor = 0;
  const stops = SEGMENT_ORDER.filter((s) => counts[s.key] > 0).map((s) => {
    const pct = total === 0 ? 0 : (counts[s.key] / total) * 100;
    const start = cursor;
    cursor += pct;
    return `${s.color} ${start}% ${cursor}%`;
  });

  const gradient =
    total === 0 ? "var(--rail)" : `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-4">
      <div className="mb-4 text-[13.5px] font-semibold">Deploy Success Rate</div>
      <div className="flex items-center gap-5">
        <div
          className="relative flex h-24 w-24 flex-none items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-panel">
            <span className="tabular font-mono text-[17px] font-semibold">
              {readyPct}%
            </span>
            <span className="text-[9.5px] text-text-faint">Ready</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          {SEGMENT_ORDER.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between text-[12px]"
            >
              <span className="flex items-center gap-1.5 text-text-dim">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="tabular font-mono text-text-faint">
                {counts[s.key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
