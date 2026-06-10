#!/usr/bin/env node
/**
 * check-links.mjs — post-build link integrity + placeholder audit over dist/.
 *  - every internal href/src resolves to a file in dist (or a generated route)
 *  - counts TODO placeholder payment/form links per page (report, not failure)
 *  - flags pages missing <title> or meta description
 * Usage: node scripts/check-links.mjs   (after pnpm build)
 * Exit 1 only on broken internal links / missing SEO; placeholders are warnings.
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, "apps", "web", "dist");
const STATUS = join(ROOT, "apps", "web", "src", "data", "status.json");

if (!existsSync(DIST)) { console.error("✗ dist/ not found. Run: pnpm build"); process.exit(1); }

const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pages.push(p);
  }
})(DIST);

const exists = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || clean === "/") return existsSync(join(DIST, "index.html"));
  const p = join(DIST, clean);
  return existsSync(p) || existsSync(p + ".html") || existsSync(join(p, "index.html"));
};

let broken = 0, seoMiss = 0, todoTotal = 0;
const perPage = {};

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const rel = page.slice(DIST.length).replace(/\\/g, "/");
  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const h of hrefs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(h)) continue;
    if (!exists(h)) { console.error(`  ✗ broken: ${h}  (in ${rel})`); broken++; }
  }
  const todos = (html.match(/TODO_REPLACE_ME/g) || []).length;
  todoTotal += todos;
  if (todos) perPage[rel] = todos;
  if (!/<title>[^<]{3,}<\/title>/.test(html)) { console.error(`  ✗ no <title>: ${rel}`); seoMiss++; }
  if (!/<meta name="description" content="[^"]{10,}"/.test(html)) { console.error(`  ✗ no meta description: ${rel}`); seoMiss++; }
}

// fold placeholder info into status.json so the dashboard reflects reality
try {
  const status = JSON.parse(readFileSync(STATUS, "utf8"));
  for (const [slug, s] of Object.entries(status.projects ?? {})) {
    const key = Object.keys(perPage).find((k) => k.includes(`/${slug}/`) || k.includes(`/${slug}.html`));
    s.tests = broken === 0 && seoMiss === 0 ? "pass" : s.tests;
    s.issues = key ? [`${perPage[key]} placeholder link(s) to fill`] : (s.issues ?? []);
  }
  const qa = status.phases?.find((p) => p.name === "QA");
  if (qa) qa.state = broken === 0 && seoMiss === 0 ? "done" : "active";
  writeFileSync(STATUS, JSON.stringify(status, null, 2));
} catch { /* status optional */ }

console.log(`\nchecked ${pages.length} pages — broken links: ${broken}, SEO misses: ${seoMiss}, TODO placeholders: ${todoTotal} (fill before launch)`);
process.exit(broken || seoMiss ? 1 : 0);
