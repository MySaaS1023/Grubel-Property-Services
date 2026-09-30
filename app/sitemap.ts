import type { MetadataRoute } from "next";

const baseUrl = "https://grubelps.com";

const routes = [
  "",
  "/about",
  "/services",
  "/contact",
  "/request-service",
  "/customer-login",
  "/work-with-us",
  "/repair",
  "/turnover-prep",
  "/builds-remodels",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/subcontractor-terms",
  "/subcontractor-agreement-notice",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
