import { Text, Link } from "@react-email/components";
import { EmailLayout, heading, paragraph, button, codeBlock } from "./EmailLayout";

export function MagicLinkEmail({ magicLink, token }) {
  return (
    <EmailLayout preview="Your sign-in link for Pulse">
      <Text style={heading}>Sign in to Pulse</Text>
      <Text style={paragraph}>
        Click the button below to sign in. This link expires shortly and can
        only be used once.
      </Text>
      <Link href={magicLink} style={button}>
        Sign in to Pulse
      </Link>
      {token && (
        <>
          <Text style={{ ...paragraph, marginTop: "24px" }}>
            Or enter this code if you were asked for one:
          </Text>
          <Text style={codeBlock}>{token}</Text>
        </>
      )}
    </EmailLayout>
  );
}

export default MagicLinkEmail;
