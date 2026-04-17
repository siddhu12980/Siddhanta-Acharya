import { ImageResponse } from "next/og";
import { getProject } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  const title = project?.frontmatter.title ?? "Project";
  const tagline = project?.frontmatter.tagline ?? "";
  const category = project?.frontmatter.category ?? "";

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
        {/* Category badge */}
        {category ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#6baad8",
                background: "rgba(107,170,216,0.12)",
                borderRadius: 6,
                padding: "6px 16px",
                letterSpacing: "0.5px",
              }}
            >
              {category}
            </div>
          </div>
        ) : null}

        {/* Title */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#efefef",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#8a8a96",
            fontWeight: 400,
            maxWidth: 800,
          }}
        >
          {tagline}
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
          }}
        >
          siddhantacharya.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
