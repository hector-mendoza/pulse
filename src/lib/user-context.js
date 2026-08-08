import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { VercelApiError } from "@/lib/vercel-api";

export async function getUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", user.id)
    .single();

  const userEmail = profile?.email ?? user.email;
  const userName = profile?.full_name || userEmail?.split("@")[0] || "You";

  const { data: vercelToken } = await supabase
    .from("vercel_tokens")
    .select("id, label, created_at")
    .maybeSingle();

  return { user, userEmail, userName, vercelToken };
}

export async function getDecryptedVercelToken(userId) {
  const admin = createAdminClient();
  const { data: token, error } = await admin.rpc(
    "get_decrypted_vercel_token",
    { p_user_id: userId }
  );

  if (error || !token) {
    throw new VercelApiError(error?.message || "Token not found.");
  }

  return token;
}
