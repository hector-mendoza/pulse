import { ImageResponse } from "next/og";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const size = Number(searchParams.get("size")) || 512;

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
        <div
          style={{
            display: "flex",
            fontSize: size * 0.52,
            color: "#04140F",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ▲
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
