import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dirk HQ",
    short_name: "Dirk HQ",
    description: "Dirk HQ Executive Operating System",
    start_url: "/calendar",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#0F172A",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
