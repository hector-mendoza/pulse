import { createElement } from "react";
import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { Resend } from "resend";
import { MagicLinkEmail } from "@/emails/MagicLinkEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { SignupConfirmationEmail } from "@/emails/SignupConfirmationEmail";

const FROM = process.env.RESEND_FROM_EMAIL || "Pulse <onboarding@resend.dev>";

function buildActionLink(redirectTo, tokenHash, actionType) {
  const url = new URL(redirectTo);
  url.searchParams.set("token_hash", tokenHash);
  url.searchParams.set("type", actionType);
  return url.toString();
}

function pickEmail(actionType, { token, actionLink }) {
  switch (actionType) {
    case "recovery":
      return {
        subject: "Reset your Pulse password",
        react: createElement(PasswordResetEmail, { resetLink: actionLink }),
      };
    case "signup":
    case "invite":
      return {
        subject: "Confirm your Pulse account",
        react: createElement(SignupConfirmationEmail, {
          confirmLink: actionLink,
        }),
      };
    case "magiclink":
    default:
      return {
        subject: "Your sign-in link for Pulse",
        react: createElement(MagicLinkEmail, { magicLink: actionLink, token }),
      };
  }
}

export async function POST(request) {
  // Constructed inside the handler, not at module scope — both SDKs
  // validate their config eagerly, which breaks Next.js's build-time page
  // data collection (that phase doesn't have real runtime env vars).
  const hookSecret = process.env.SUPABASE_AUTH_HOOK_SECRET?.replace(
    /^v1,whsec_/,
    ""
  );

  if (!hookSecret || !process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: { http_code: 500, message: "Email sending not configured." } },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await request.text();
  const headers = Object.fromEntries(request.headers);

  let payload;
  try {
    const wh = new Webhook(hookSecret);
    payload = wh.verify(body, headers);
  } catch (err) {
    return NextResponse.json(
      { error: { http_code: 401, message: "Invalid signature: " + err.message } },
      { status: 401 }
    );
  }

  try {
    const { user, email_data: emailData } = payload;
    const { token, token_hash: tokenHash, redirect_to: redirectTo, email_action_type: actionType } =
      emailData;

    const actionLink = buildActionLink(redirectTo, tokenHash, actionType);
    const { subject, react } = pickEmail(actionType, { token, actionLink });

    const { error } = await resend.emails.send({
      from: FROM,
      to: user.email,
      subject,
      react,
    });

    if (error) {
      return NextResponse.json(
        { error: { http_code: 500, message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json(
      { error: { http_code: 500, message: err.message } },
      { status: 500 }
    );
  }
}
