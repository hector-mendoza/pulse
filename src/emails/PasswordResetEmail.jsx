import { Text, Link } from "@react-email/components";
import { EmailLayout, heading, paragraph, button } from "./EmailLayout";

export function PasswordResetEmail({ resetLink }) {
  return (
    <EmailLayout preview="Reset your Pulse password">
      <Text style={heading}>Reset your password</Text>
      <Text style={paragraph}>
        We got a request to reset the password on your Pulse account. Click
        below to choose a new one. This link expires shortly.
      </Text>
      <Link href={resetLink} style={button}>
        Reset password
      </Link>
      <Text style={{ ...paragraph, marginTop: "24px", fontSize: "12px" }}>
        Didn&apos;t request this? You can ignore this email — your password
        won&apos;t change.
      </Text>
    </EmailLayout>
  );
}

export default PasswordResetEmail;
