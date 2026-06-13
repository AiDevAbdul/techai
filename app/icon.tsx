import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#15573D",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          flexDirection: "column",
        }}
      >
        {/* AW monogram */}
        <div
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-1px",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
          }}
        >
          AW
        </div>
        {/* Brand dot accent */}
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
            marginTop: 5,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
