import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Daily ping so Free Plan Supabase projects stay active.
 * Hits Postgres via PostgREST — auth health checks do not count.
 * Secured with CRON_SECRET (Vercel sends Authorization: Bearer …).
 */
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      { error: "Keepalive query failed", detail: error.message },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
