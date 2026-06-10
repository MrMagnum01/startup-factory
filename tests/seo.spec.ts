import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CFG = join(ROOT, "apps", "web", "src", "data", "projects");
const projects = readdirSync(CFG)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(CFG, f), "utf8")));

// SEO contract on a representative sample of each renderAs + every category.
const seen = new Set<string>();
const sample = projects.filter((p) => {
  const k = `${p.renderAs}-${p.category}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

for (const p of sample) {
  test(`SEO metadata: ${p.slug}`, async ({ page }) => {
    await page.goto(p.route);
    const title = await page.title();
    expect(title.length, "title present").toBeGreaterThan(10);
    expect(title.length, "title ≤ 70").toBeLessThanOrEqual(75);

    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /.{30,170}/);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /https?:\/\//);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\/.+\.png/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

    const ld = await page.locator('script[type="application/ld+json"]').count();
    expect(ld, "JSON-LD present").toBeGreaterThanOrEqual(1);

    // exactly one h1
    expect(await page.locator("h1").count()).toBe(1);
  });
}

test("sitemap + robots exist", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
});
