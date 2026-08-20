import { LoginForm } from "./LoginForm";
import { safeNextPath } from "@/lib/supabase/env";

export const metadata = {
  title: "Sign in — Pulse",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <LoginForm
        authError={params.error}
        nextPath={safeNextPath(params.next)}
      />
    </div>
  );
}
