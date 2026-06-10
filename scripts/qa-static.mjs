#!/usr/bin/env node
/**
 * qa-static.mjs — browserless QA over dist/. Verifies the launch contract for
 * every generated project page without needing a headless browser:
 *  one <h1>, valid <title>/description lengths, canonical, og:image PNG,
 *  twitter card, JSON-LD, and the CTA contract per renderAs
 *  (offer→[data-cta], tool→#tool + inputs, directory→#dir-search + ≥8 items).
 * Live JS behaviour (calculators computing etc.) is covered by tests/tools.spec.ts in CI.
 * Exit 1 on any contract failure.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, "apps", "web", "dist");
const CFG = join(ROOT, "apps", "web", "src", "data", "projects");
const projects = readdirSync(CFG).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(CFG, f), "utf8")));

const distPath = (route) => join(DIST, route, "index.html");
let fails = 0, checks = 0;
const fail = (slug, msg) => { console.error(`  ✗ ${slug}: ${msg}`); fails++; };
const ok = () => { checks++; };
const count = (h, re) => (h.match(re) || []).length;

for (const p of projects) {
  const fp = distPath(p.route);
  if (!existsSync(fp)) { fail(p.slug, `no HTML at ${p.route}`); continue; }
  const h = readFileSync(fp, "utf8");

  const h1 = count(h, /<h1[\s>]/g);
  h1 === 1 ? ok() : fail(p.slug, `expected 1 <h1>, found ${h1}`);

  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  title.length >= 10 && title.length <= 75 ? ok() : fail(p.slug, `title length ${title.length}`);

  /<meta name="description" content="[^"]{20,170}"/.test(h) ? ok() : fail(p.slug, "bad/missing meta description");
  /<link rel="canonical" href="https?:\/\//.test(h) ? ok() : fail(p.slug, "missing canonical");
  /<meta property="og:image" content="[^"]+\/og\/[^"]+\.png"/.test(h) ? ok() : fail(p.slug, "missing PNG og:image");
  /<meta name="twitter:card" content="summary_large_image"/.test(h) ? ok() : fail(p.slug, "missing twitter card");
  /application\/ld\+json/.test(h) ? ok() : fail(p.slug, "missing JSON-LD");

  if (p.renderAs === "tool") {
    /id="tool"/.test(h) ? ok() : fail(p.slug, "tool page missing #tool");
    (count(h, /<input|<button|<select|<textarea/g) >= 2) ? ok() : fail(p.slug, "tool page has no interactive controls");
  } else if (p.renderAs === "directory") {
    /id="dir-search"/.test(h) ? ok() : fail(p.slug, "directory missing search");
    const items = count(h, /class="[^"]*dir-item/g);
    items >= 8 ? ok() : fail(p.slug, `directory has ${items} items (<8)`);
  } else {
    /data-cta="/.test(h) ? ok() : fail(p.slug, "offer page missing a CTA");
  }
}

// hubs + dashboard exist
for (const hub of ["projects", "tools", "directories", "templates", "services", "dashboard", "about"]) {
  existsSync(join(DIST, hub, "index.html")) ? ok() : fail(hub, "hub page missing");
}
existsSync(join(DIST, "404.html")) ? ok() : fail("404", "missing 404");
existsSync(join(DIST, "sitemap.xml")) ? ok() : fail("sitemap", "missing sitemap");
/noindex/.test(readFileSync(join(DIST, "dashboard", "index.html"), "utf8")) ? ok() : fail("dashboard", "dashboard not noindexed");

console.log(`\nqa-static: ${projects.length} projects · ${checks} checks passed · ${fails} failure(s)`);
process.exit(fails ? 1 : 0);
