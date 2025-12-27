import type { MetadataRoute } from "next";

export const dynamic = "force-static";

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = fromEnv?.length ? fromEnv : "https://encoflow.studio";
  return baseUrl.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
