"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyVercelToken, VercelApiError } from "@/lib/vercel-api";

export async function saveVercelToken(prevState, formData) {
  const token = formData.get("token")?.toString().trim();

  if (!token) {
    return { error: "Enter a Vercel token." };
  }

  try {
    await verifyVercelToken(token);
  } catch (err) {
    if (err instanceof VercelApiError) {
      return { error: `Vercel rejected this token: ${err.message}` };
    }
    return { error: "Couldn't reach the Vercel API. Try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("store_vercel_token", {
    p_token: token,
    p_label: "default",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { message: "Vercel account connected." };
}

export async function disconnectVercelToken() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_vercel_token");

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { message: "Vercel account disconnected." };
}
