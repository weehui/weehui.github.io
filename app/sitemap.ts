import type { MetadataRoute } from "next";

export const dynamic = "force-static";

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = fromEnv?.length ? fromEnv : "https://encoflow.studio";
  return baseUrl.replace(/\/+$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  return [
    { url: `${baseUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/3d-pailiti/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/3d-pailiti/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/3d-pailiti/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/koala-haventree/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/koala-haventree/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/koala-haventree/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
