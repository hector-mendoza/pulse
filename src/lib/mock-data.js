const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const projects = [
  { id: "all", name: "All" },
  { id: "urvenue-oracle", name: "urvenue-oracle" },
  { id: "pille-os", name: "pille-os" },
  { id: "agent-ready", name: "agent-ready" },
  { id: "hectormendoza.me", name: "hectormendoza.me" },
];

// offsetMs = how long ago this deployment happened, relative to request time.
export const deployments = [
  { id: "a3f9c1e", message: "fix: session refresh on Oracle", status: "building", project: "urvenue-oracle", commit: "a3f9c1e", offsetMs: 40_000 },
  { id: "e88b204", message: "feat: fitness module v2", status: "ready", project: "pille-os", commit: "e88b204", offsetMs: 12 * MIN },
  { id: "f1029ad", message: "chore: bump deps AI compliance", status: "error", project: "agent-ready", commit: "f1029ad", offsetMs: 34 * MIN, detail: "type error in build" },
  { id: "9c02d4b", message: "content: new blog post", status: "ready", project: "hectormendoza.me", commit: "9c02d4b", offsetMs: 1 * HOUR },
  { id: "7bb41aa", message: "sync: team preview branch", status: "queued", project: "urvenue-oracle", commit: "7bb41aa", offsetMs: 2 * HOUR },
  { id: "2b7e5f1", message: "feat: onboarding checklist", status: "ready", project: "pille-os", commit: "2b7e5f1", offsetMs: 1 * DAY + 3 * HOUR },
  { id: "d4a8c33", message: "fix: broken image upload", status: "ready", project: "agent-ready", commit: "d4a8c33", offsetMs: 2 * DAY + 5 * HOUR },
  { id: "9f21ab0", message: "chore: rotate API keys", status: "error", project: "urvenue-oracle", commit: "9f21ab0", offsetMs: 3 * DAY + 1 * HOUR, detail: "env var missing" },
  { id: "c7715e2", message: "feat: dark mode toggle", status: "ready", project: "hectormendoza.me", commit: "c7715e2", offsetMs: 4 * DAY + 6 * HOUR },
  { id: "184fbd6", message: "fix: mobile nav overflow", status: "ready", project: "pille-os", commit: "184fbd6", offsetMs: 5 * DAY + 2 * HOUR },
];
