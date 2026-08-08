import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in — Pulse",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <LoginForm />
    </div>
  );
}
