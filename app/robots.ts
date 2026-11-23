import type { MetadataRoute } from "next";
import { PROFILE } from "./data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${PROFILE.site}/sitemap.xml`,
  };
}
