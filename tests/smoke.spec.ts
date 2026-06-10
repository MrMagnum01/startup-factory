import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CFG = join(ROOT, "apps", "web", "src", "data", "projects");
const projects = readdirSync(CFG)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(CFG, f), "utf8")));

test("home page renders with hero + nav", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("header")).toBeVisible();
  expect(await page.locator("header a[href='/projects']").count()).toBeGreaterThan(0);
  expect(await page.title()).not.toEqual("");
});

test("hub pages render", async ({ page }) => {
  for (const hub of ["/projects", "/tools", "/directories", "/templates", "/services"]) {
    await page.goto(hub);
    await expect(page.locator("h1"), `${hub} h1`).toBeVisible();
  }
});

test("dashboard renders KPIs", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator("dl")).toBeVisible();
  await expect(page.locator("table")).toBeVisible();
});

// Every generated project page: loads, has h1, has its CTA contract.
for (const p of projects) {
  test(`project ${p.slug} (${p.renderAs}) renders + CTA`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(p.route);
    await expect(page.locator("h1").first()).toBeVisible();

    if (p.renderAs === "tool") {
      await expect(page.locator("#tool")).toBeVisible();
    } else if (p.renderAs === "directory") {
      await expect(page.locator("#dir-search")).toBeVisible();
      expect(await page.locator(".dir-item").count()).toBeGreaterThanOrEqual(8);
    } else {
      const cta = page.locator("[data-cta]").first();
      await expect(cta).toBeVisible();
    }
    expect(errors, `JS errors on ${p.route}: ${errors.join("; ")}`).toHaveLength(0);
  });
}

test("404 page works", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page-xyz");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toBeVisible();
});
