import { Text, Link } from "@react-email/components";
import { EmailLayout, heading, paragraph, button } from "./EmailLayout";

export function SignupConfirmationEmail({ confirmLink }) {
  return (
    <EmailLayout preview="Confirm your Pulse account">
      <Text style={heading}>Confirm your email</Text>
      <Text style={paragraph}>
        Welcome to Pulse — click below to confirm your email and finish
        setting up your account.
      </Text>
      <Link href={confirmLink} style={button}>
        Confirm email
      </Link>
    </EmailLayout>
  );
}

export default SignupConfirmationEmail;
