import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

// Service-role client — bypasses RLS. Only ever call this from server
// code (server components, actions, route handlers), never expose it to
// the browser. Used to decrypt a user's Vercel token via the
// get_decrypted_vercel_token() Postgres function, which is itself
// revoked from the anon/authenticated roles.
export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
