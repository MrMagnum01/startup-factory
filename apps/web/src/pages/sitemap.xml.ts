import type { APIRoute } from "astro";
import { projects } from "../lib/projects";

const STATIC = ["/", "/projects", "/tools", "/directories", "/templates", "/services", "/about"];

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() || "https://startup-factory.vercel.app").replace(/\/$/, "");
  const today = new Date().toISOString().slice(0, 10);
  const urls = [...STATIC, ...projects.map((p: any) => p.route)];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${base}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
