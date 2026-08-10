import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Reset password — Pulse",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <ResetPasswordForm />
    </div>
  );
}
