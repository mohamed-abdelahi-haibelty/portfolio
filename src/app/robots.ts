import type { MetadataRoute } from "next";
import { buildRobots, isIndexable } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(SITE_URL, isIndexable({ VERCEL_ENV: process.env.VERCEL_ENV }));
}
