import { test, expect } from "@playwright/test";

// Functional checks for the real client-side tools (the revenue-relevant interactions).

test("rate calculator computes an hourly rate", async ({ page }) => {
  await page.goto("/tools/rateright");
  await page.fill("#rc-income", "100000");
  const hourly = await page.locator("#rc-hourly").textContent();
  expect(hourly).toMatch(/\$\d/);
});

test("mortgage payoff shows interest saved", async ({ page }) => {
  await page.goto("/tools/payoffplus");
  await page.fill("#mp-extra", "300");
  await expect(page.locator("#mp-saved-i")).toHaveText(/\$\d/);
});

test("saas metrics computes LTV and verdict", async ({ page }) => {
  await page.goto("/tools/saasmetrics");
  await page.fill("#sm-arpu", "49");
  await expect(page.locator("#sm-ltv")).toHaveText(/\$\d/);
  await expect(page.locator("#sm-verdict")).not.toHaveText("—");
});

test("utm builder builds a tracked link", async ({ page }) => {
  await page.goto("/tools/utm-link-builder");
  await page.fill("#ut-url", "https://example.com/page");
  await page.fill("#ut-source", "newsletter");
  await page.fill("#ut-medium", "email");
  await page.fill("#ut-campaign", "june_launch");
  await expect(page.locator("#ut-out")).toHaveText(/utm_source=newsletter/);
});

test("meta tag generator emits og tags", async ({ page }) => {
  await page.goto("/tools/metapreview");
  await page.fill("#mt-title", "A genuinely good page title");
  await page.fill("#mt-desc", "A description long enough to be realistic for search snippets.");
  await expect(page.locator("#mt-code")).toContainText('og:title');
});

test("invoice generator computes totals", async ({ page }) => {
  await page.goto("/tools/invoicenow");
  await expect(page.locator("#iv-total")).toHaveText(/\$\d/);
});

test("cold email generator produces a 3-email sequence", async ({ page }) => {
  await page.goto("/tools/coldgen");
  await page.fill("#ce-role", "dentists");
  await page.fill("#ce-pain", "no Google reviews");
  await page.fill("#ce-offer", "a review system setup");
  await page.fill("#ce-cta", "worth a quick look?");
  await page.fill("#ce-name", "Sam");
  await page.click("#ce-gen");
  expect(await page.locator("#ce-out .card").count()).toBe(3);
});

test("policy generator outputs both documents", async ({ page }) => {
  await page.goto("/tools/policygen");
  await page.fill("#pg-name", "Acme");
  await page.fill("#pg-url", "https://acme.app");
  await page.fill("#pg-email", "privacy@acme.app");
  await page.click("#pg-gen");
  await expect(page.locator("#pg-out")).toHaveValue(/PRIVACY POLICY/);
  await page.click('[data-tab="terms"]');
  await expect(page.locator("#pg-out")).toHaveValue(/TERMS OF SERVICE/);
});

test("resume bullets generates 5 quantified bullets", async ({ page }) => {
  await page.goto("/tools/bulletboost");
  await page.fill("#rb-task", "managed the newsletter");
  await page.fill("#rb-metric", "open rate from 18% to 31%");
  await page.click("#rb-gen");
  expect(await page.locator("#rb-out li").count()).toBe(5);
});

test("quote estimator prices a project", async ({ page }) => {
  await page.goto("/tools/quoteestimator");
  await page.fill("#qe-hours", "40");
  await expect(page.locator("#qe-quote")).toHaveText(/\$\d/);
});
