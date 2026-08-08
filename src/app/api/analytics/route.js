import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWebAnalytics, VercelApiError } from "@/lib/vercel-api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: vercelToken } = await supabase
    .from("vercel_tokens")
    .select("id")
    .maybeSingle();

  if (!vercelToken) {
    return NextResponse.json({ error: "No Vercel account connected" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: token, error } = await admin.rpc("get_decrypted_vercel_token", {
    p_user_id: user.id,
  });

  if (error || !token) {
    return NextResponse.json({ error: "Couldn't decrypt Vercel token" }, { status: 500 });
  }

  try {
    const analytics = await getWebAnalytics(token, { projectId });
    return NextResponse.json(analytics);
  } catch (err) {
    const message = err instanceof VercelApiError ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
