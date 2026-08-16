import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function EmailLayout({ preview, children }) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={body}>
        <Container style={container}>
          <Section style={brandRow}>
            <table role="presentation" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={logoBadge}>▲</td>
                <td style={logoText}>Pulse</td>
              </tr>
            </table>
          </Section>

          <Section style={card}>{children}</Section>

          <Text style={footer}>
            You&apos;re receiving this because it was requested for your
            Pulse account. If this wasn&apos;t you, you can safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f7f9",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "40px 0",
};

const container = {
  maxWidth: "420px",
  margin: "0 auto",
  padding: "0 20px",
};

const brandRow = {
  marginBottom: "20px",
};

const logoBadge = {
  width: "30px",
  height: "30px",
  borderRadius: "8px",
  background: "linear-gradient(160deg, #2FD9A8, #15A87E)",
  color: "#04140F",
  fontWeight: 700,
  fontSize: "14px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "30px",
};

const logoText = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#12151A",
  paddingLeft: "10px",
};

const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #e9ebee",
  borderRadius: "16px",
  padding: "28px",
};

const footer = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.6",
  padding: "0 4px",
  marginTop: "20px",
};

export const heading = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#12151A",
  margin: "0 0 12px",
};

export const paragraph = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.6",
  margin: "0 0 20px",
};

export const button = {
  display: "inline-block",
  backgroundColor: "#0E4B36",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  borderRadius: "8px",
  padding: "12px 20px",
};

export const codeBlock = {
  fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
  fontSize: "24px",
  fontWeight: 700,
  letterSpacing: "4px",
  color: "#12151A",
  backgroundColor: "#f6f7f9",
  border: "1px solid #e9ebee",
  borderRadius: "8px",
  padding: "14px 20px",
  textAlign: "center",
};
