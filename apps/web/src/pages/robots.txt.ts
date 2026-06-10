import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("/sitemap.xml", site ?? "https://startup-factory.vercel.app").toString();
  return new Response(
    ["User-agent: *", "Allow: /", "Disallow: /dashboard", "", `Sitemap: ${sitemap}`, ""].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
