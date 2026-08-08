import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          backgroundImage: "linear-gradient(160deg, #2FD9A8, #0E4B36)",
        }}
      >
        <div style={{ display: "flex", fontSize: 18, color: "#04140F", fontWeight: 700 }}>
          ▲
        </div>
      </div>
    ),
    { ...size }
  );
}
