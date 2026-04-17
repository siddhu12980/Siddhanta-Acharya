import { ImageResponse } from "next/og";
import { getNote } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNote(slug);

  const title = note?.frontmatter.title ?? "Note";
  const summary = note?.frontmatter.summary ?? "";
  const date = note?.frontmatter.date
    ? new Date(note.frontmatter.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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
        {/* Date */}
        {date ? (
          <div
            style={{
              marginBottom: 28,
              fontSize: 18,
              color: "#8a8a96",
              fontWeight: 400,
              letterSpacing: "0.5px",
            }}
          >
            {date}
          </div>
        ) : null}

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#efefef",
            letterSpacing: "-1px",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Summary */}
        {summary ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: "#8a8a96",
              fontWeight: 400,
              maxWidth: 800,
            }}
          >
            {summary}
          </div>
        ) : null}

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
