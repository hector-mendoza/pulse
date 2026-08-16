import "server-only";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

// Fails open on infra errors — a rate-limit hiccup should never lock the
// owner out of their own personal-use app.
export async function checkRateLimit(
  identifier,
  action,
  { maxAttempts = 5, windowMinutes = 15 } = {}
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_auth_rate_limit", {
    p_identifier: identifier,
    p_action: action,
    p_max_attempts: maxAttempts,
    p_window_minutes: windowMinutes,
  });

  if (error) return true;
  return data;
}

export const RATE_LIMIT_MESSAGE =
  "Too many attempts. Please wait a few minutes and try again.";
