export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSiteUrl() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";

  url = url.trim().replace(/\/+$/, "");

  // A missing scheme makes Supabase treat redirectTo as a path on
  // *.supabase.co — e.g. pulse.hectormendoza.me/auth/callback becomes
  // https://<project>.supabase.co/pulse.hectormendoza.me/auth/callback.
  if (!/^https?:\/\//i.test(url)) {
    const isLocal = /^(localhost|127\.0\.0\.1)(:|$)/.test(url);
    url = `${isLocal ? "http" : "https"}://${url}`;
  }

  return url;
}

// Only allow same-origin relative paths through `next` redirect params.
export function safeNextPath(next) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}
