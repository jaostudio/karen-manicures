import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            marginBottom: 16,
          }}
        >
          💅
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#9d174d",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Karen Manicures
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "#6b7280",
            marginTop: 12,
          }}
        >
          Beautiful Nails for Every Occasion
        </p>
        <p
          style={{
            fontSize: 20,
            color: "#ec4899",
            marginTop: 8,
          }}
        >
          Calauag, Quezon — Book Online
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
