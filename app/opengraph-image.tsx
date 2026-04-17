import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#141418",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 56,
            height: 4,
            background: "#6baad8",
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#efefef",
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}
        >
          {SITE_NAME}
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#8a8a96",
            fontWeight: 400,
            maxWidth: 700,
          }}
        >
          {SITE_DESCRIPTION}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 80,
            fontSize: 18,
            color: "#6baad8",
            fontWeight: 500,
            letterSpacing: "0.5px",
          }}
        >
          siddhantacharya.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
