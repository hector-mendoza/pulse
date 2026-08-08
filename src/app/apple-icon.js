import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(160deg, #2FD9A8, #0E4B36)",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, color: "#04140F", fontWeight: 700 }}>
          ▲
        </div>
      </div>
    ),
    { ...size }
  );
}
