"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, safeNextPath } from "@/lib/supabase/env";
import { checkRateLimit, getClientIp, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export async function signInWithPassword(prevState, formData) {
  const email = formData.get("email");
  const ip = await getClientIp();

  const [emailOk, ipOk] = await Promise.all([
    checkRateLimit(email, "signin", { maxAttempts: 5, windowMinutes: 15 }),
    checkRateLimit(ip, "signin", { maxAttempts: 20, windowMinutes: 15 }),
  ]);

  if (!emailOk || !ipOk) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: formData.get("password"),
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signUpWithPassword(prevState, formData) {
  const email = formData.get("email");
  const ip = await getClientIp();

  const [emailOk, ipOk] = await Promise.all([
    checkRateLimit(email, "signup", { maxAttempts: 3, windowMinutes: 60 }),
    checkRateLimit(ip, "signup", { maxAttempts: 10, windowMinutes: 60 }),
  ]);

  if (!emailOk || !ipOk) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password: formData.get("password"),
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message: "Check your inbox to confirm your email before signing in.",
  };
}

export async function requestPasswordReset(prevState, formData) {
  const email = formData.get("email");
  const ip = await getClientIp();

  const [emailOk, ipOk] = await Promise.all([
    checkRateLimit(email, "reset", { maxAttempts: 3, windowMinutes: 15 }),
    checkRateLimit(ip, "reset", { maxAttempts: 10, windowMinutes: 15 }),
  ]);

  if (!emailOk || !ipOk) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/confirm?next=/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Check your inbox for a password reset link." };
}

export async function signInWithMagicLink(prevState, formData) {
  const email = formData.get("email");
  const ip = await getClientIp();

  const [emailOk, ipOk] = await Promise.all([
    checkRateLimit(email, "magic", { maxAttempts: 3, windowMinutes: 15 }),
    checkRateLimit(ip, "magic", { maxAttempts: 10, windowMinutes: 15 }),
  ]);

  if (!emailOk || !ipOk) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Check your inbox for the magic link." };
}

export async function signInWithGitHub(prevState, formData) {
  const ip = await getClientIp();
  const ipOk = await checkRateLimit(ip, "github", {
    maxAttempts: 10,
    windowMinutes: 15,
  });

  if (!ipOk) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const next = safeNextPath(formData?.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }

  return { error: "GitHub sign-in is not available right now." };
}
