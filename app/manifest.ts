import type { MetadataRoute } from "next";
import { PROFILE } from "./data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PROFILE.name} | ${PROFILE.role}`,
    short_name: "oanyarko7",
    description: "Backend and Full-Stack Developer Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#090b09",
    theme_color: "#090b09",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
