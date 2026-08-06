import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "#0F172A", display: "flex", height: "100%", justifyContent: "center", position: "relative", width: "100%" }}>
        <div style={{ alignItems: "center", background: "#2563EB", border: "16px solid #93C5FD", borderRadius: 104, boxShadow: "0 0 0 22px #1E3A8A", color: "#FFFFFF", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 282, fontWeight: 800, height: 308, justifyContent: "center", lineHeight: 1, paddingBottom: 16, width: 308 }}>
          D
        </div>
      </div>
    ),
    { ...size },
  );
}
