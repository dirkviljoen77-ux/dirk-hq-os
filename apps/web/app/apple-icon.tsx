import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "#0F172A", display: "flex", height: "100%", justifyContent: "center", width: "100%" }}>
        <div style={{ alignItems: "center", background: "#2563EB", border: "6px solid #93C5FD", borderRadius: 38, boxShadow: "0 0 0 8px #1E3A8A", color: "#FFFFFF", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 102, fontWeight: 800, height: 108, justifyContent: "center", lineHeight: 1, paddingBottom: 7, width: 108 }}>
          D
        </div>
      </div>
    ),
    { ...size },
  );
}
