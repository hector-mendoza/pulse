"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithPassword(prevState, formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signUpWithPassword(prevState, formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message: "Check your inbox to confirm your email before signing in.",
  };
}

export async function signInWithMagicLink(prevState, formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get("email"),
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Check your inbox for the magic link." };
}
