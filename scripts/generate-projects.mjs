#!/usr/bin/env node
/**
 * generate-projects.mjs — the factory core.
 * Reads  data/ideas_top50.json  (produced by scripts/assessment.py)
 * Emits  apps/web/src/data/projects/project-XXX-<slug>.json  (validated against @factory/config)
 *        apps/web/src/data/status.json                       (drives /dashboard)
 *
 * Deterministic: same input -> same output. Re-run any time; it overwrites cleanly.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ProjectConfigSchema } from "../packages/config/index.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const IDEAS = join(ROOT, "data", "ideas_top50.json");
const OUT_DIR = join(ROOT, "apps", "web", "src", "data", "projects");
const STATUS = join(ROOT, "apps", "web", "src", "data", "status.json");

if (!existsSync(IDEAS)) {
  console.error("✗ data/ideas_top50.json not found. Run: python3 scripts/assessment.py");
  process.exit(1);
}
const ideas = JSON.parse(readFileSync(IDEAS, "utf8"));

/* ---------------- helpers ---------------- */
const slugify = (s) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// SEO-friendly slug overrides (esp. directories — must match data/directory-seeds/*.json).
const SLUG_OVERRIDES = {
  "FreeTierDev": "free-tier-dev",
  "AIToolsForLawyers": "ai-tools-for-lawyers",
  "SponsorList": "sponsor-list",
  "RemoteFirst": "remote-first-companies",
  "NicheJobs": "ai-ml-jobs",
  "StartupPerks": "startup-perks",
  "BoilerHub": "boilerhub",
  "TDEEpro": "tdee-calculator",
  "UTM+QR": "utm-link-builder",
  "InMakeover": "linkedin-makeover",
  "GBP Launch": "google-business-profile-setup",
  "ResumeRev": "resume-rewrite",
  "ShopSpeed Fix": "shopify-speed-fix",
  "LocalRank Audit": "local-seo-audit",
};

// Route group per category (preferred URL structure).
const GROUP = {
  "micro-tool": "tools", calculator: "tools", generator: "tools",
  directory: "directories",
  "template pack": "templates",
  "productized service": "services",
  "lead-gen site": "projects", "landing page": "projects", "mini SaaS": "projects",
};

// Curated accent palette — rotated per project so the estate feels art-directed, not random.
const PALETTE = [
  ["#15634C", "#0B2A20"], ["#7C3F00", "#2E1800"], ["#1D4ED8", "#0B1E4B"],
  ["#9D174D", "#3D0A20"], ["#3F6212", "#1A2A06"], ["#6D28D9", "#27104F"],
  ["#0E7490", "#062E3A"], ["#B45309", "#3F1D03"], ["#BE123C", "#45041A"],
  ["#374151", "#111827"],
];

// Which ideas become REAL client-side tools (the five committed tools).
const TOOL_IMPL = {
  "RateRight": "rate-calculator",
  "TDEEpro": "tdee-calculator",
  "PassForge": "password-generator",
  "ReadCheck": "readability-checker",
  "UTM+QR": "utm-builder",
  "MetaPreview": "meta-tags",
  "InvoiceNow": "invoice-generator",
  "BulletBoost": "resume-bullets",
  "PayoffPlus": "mortgage-payoff",
  "SaaSMetrics": "saas-metrics",
  "QuoteEstimator": "quote-estimator",
  "PolicyGen": "policy-generator",
  "ColdGen": "cold-email-generator",
};

const ctaFor = (idea) => {
  switch (idea.type) {
    case "productized service":
      return { type: "payment", label: "Book it now", href: "#", note: "Fixed price. Stripe secure checkout. 48–72h turnaround." };
    case "template pack":
      return { type: "download", label: "Get the pack", href: "#", note: "Instant download. Free updates. 14-day refund." };
    case "lead-gen site":
      return { type: "leadform", label: "Get free quotes", href: "#lead", note: "Free, no obligation. Reply within one business day." };
    case "landing page":
      return { type: "waitlist", label: "Join the waitlist", href: "#", note: "Early-bird price locked for the first 50." };
    case "directory":
      return { type: "waitlist", label: "Submit a listing", href: "#", note: "Free submissions reviewed weekly. Featured slots paid." };
    default:
      return TOOL_IMPL[idea.name]
        ? { type: "tool", label: "Use the free tool", href: "#tool", note: "Free. No signup. Runs entirely in your browser." }
        : { type: "waitlist", label: "Get early access", href: "#", note: "Be first when the full version ships." };
  }
};

const featuresFor = (idea) => {
  const mvpBits = String(idea.mvp).split(/,\s*/).slice(0, 6);
  return mvpBits.map((b, i) => {
    const t = b.replace(/^[a-z]/, (c) => c.toUpperCase()).split(":")[0];
    return { title: t.length > 42 ? t.slice(0, 42).replace(/\s\S*$/, "") : t, body: b.endsWith(".") ? b : b + "." };
  }).filter((f) => f.title.length > 2).slice(0, 6);
};

const specsFor = (idea) => {
  const s = [
    { k: "Format", v: idea.type },
    { k: "Price", v: String(idea.price) },
    { k: "Turnaround", v: idea.build ? `${idea.build} build effort` : "Instant" },
    { k: "Monetization", v: String(idea.monetization).split(",")[0] },
    { k: "Channel", v: String(idea.channel).split(",")[0] },
  ];
  if (idea.type === "productized service") s[2] = { k: "Turnaround", v: "48–72 hours" };
  if (idea.type === "template pack") s[2] = { k: "Delivery", v: "Instant download" };
  return s;
};

const tiersFor = (idea) => {
  const price = String(idea.price);
  const m = price.match(/\$\d+(?:\.\d+)?/g) || [];
  if (idea.type === "productized service") {
    const p = m[0] ?? "$149";
    return {
      note: "One fixed price. No retainers, no surprises.",
      tiers: [{
        name: "The package", price: p, summary: idea.desc,
        features: String(idea.mvp).split(/,\s*/).slice(0, 5),
        highlighted: true,
      }],
    };
  }
  if (idea.type === "template pack") {
    const p = m[0] ?? "$19";
    return {
      note: "Pay once, use forever. Free updates included.",
      tiers: [{
        name: "Full pack", price: p, summary: "Everything inside, instant download.",
        features: String(idea.mvp).split(/,\s*/).slice(0, 5),
        highlighted: true,
      }],
    };
  }
  if (TOOL_IMPL[idea.name] && /\$\d+/.test(price)) {
    const p = m[m.length - 1] ?? "$9";
    return {
      note: "",
      tiers: [{
        name: "Pro unlock", price: p, summary: "Support the tool, unlock the extras.",
        features: ["Everything in free", "Pro presets & exports", "Lifetime license", "Email support"],
        highlighted: false,
      }],
    };
  }
  return { note: "", tiers: [] };
};

const faqFor = (idea) => {
  const faqs = [
    { q: "Who is this for?", a: `${idea.target}. If that's you and "${idea.pain.toLowerCase()}" sounds familiar, this was built for your exact situation.` },
    { q: "Why would I pay for this?", a: idea.why_pay + "." },
    { q: "How fast do I get it?", a: idea.type === "productized service" ? "Within 48–72 hours of ordering. You'll get a confirmation immediately and the deliverable by email." : idea.type === "template pack" ? "Instantly. The download link arrives the moment payment clears." : "Right now — everything on this page works immediately, free." },
  ];
  if (idea.type === "productized service") faqs.push({ q: "What if I'm not happy?", a: "One free revision round is included. If the deliverable misses the agreed scope, you get a full refund — no argument." });
  if (idea.type === "template pack") faqs.push({ q: "What's the refund policy?", a: "14 days, no questions asked. If it doesn't fit your workflow, reply to the receipt email and we refund you." });
  if (TOOL_IMPL[idea.name]) faqs.push({ q: "Is my data uploaded anywhere?", a: "No. The tool runs 100% in your browser — nothing you type or upload ever leaves your device. You can verify in DevTools: zero network calls during use." });
  return faqs;
};

const seoFor = (idea) => {
  let t = `${idea.name} — ${idea.desc.replace(/\.$/, "")}`;
  if (t.length > 70) t = t.slice(0, 67).replace(/\s\S*$/, "") + "…";
  let d = `${idea.desc} Built for ${idea.target.toLowerCase()}. ${String(idea.price).startsWith("Free") ? "Free to use." : `From ${String(idea.price).split(/[-–]/)[0].trim()}.`}`;
  if (d.length > 165) d = d.slice(0, 162).replace(/\s\S*$/, "") + "…";
  return { t, d };
};

// Seed data for directory projects (kept honest: well-known, real entries).
const DIR_SEED = {
  "FreeTierDev": {
    facets: ["Hosting", "Database", "Auth", "CI/CD", "Monitoring"],
    items: [
      { name: "Vercel", category: "Hosting", blurb: "100GB bandwidth/mo, serverless functions, preview deploys on the Hobby plan.", url: "https://vercel.com/pricing" },
      { name: "Cloudflare Pages", category: "Hosting", blurb: "Unlimited static requests & bandwidth, 500 builds/mo free.", url: "https://pages.cloudflare.com" },
      { name: "Netlify", category: "Hosting", blurb: "100GB bandwidth, 300 build minutes/mo on the free tier.", url: "https://www.netlify.com/pricing" },
      { name: "GitHub Pages", category: "Hosting", blurb: "Free static hosting straight from a repo, 100GB/mo soft cap.", url: "https://pages.github.com" },
      { name: "Supabase", category: "Database", blurb: "500MB Postgres, auth & storage included, pauses after 1 week idle.", url: "https://supabase.com/pricing", featured: true },
      { name: "Neon", category: "Database", blurb: "Serverless Postgres with branching; generous always-free compute hours.", url: "https://neon.tech/pricing" },
      { name: "Turso", category: "Database", blurb: "Edge SQLite; huge free row reads, great for read-heavy apps.", url: "https://turso.tech/pricing" },
      { name: "Firebase Auth", category: "Auth", blurb: "50k monthly active users free — hard to outgrow early.", url: "https://firebase.google.com/pricing" },
      { name: "Auth.js", category: "Auth", blurb: "Open-source, self-hosted auth for Next.js & friends. $0 forever.", url: "https://authjs.dev" },
      { name: "GitHub Actions", category: "CI/CD", blurb: "2,000 CI minutes/mo free for private repos; unlimited for public.", url: "https://github.com/features/actions" },
      { name: "UptimeRobot", category: "Monitoring", blurb: "50 monitors, 5-min checks free — enough for a whole portfolio.", url: "https://uptimerobot.com" },
      { name: "Better Stack", category: "Monitoring", blurb: "10 monitors with 3-min checks + status page on the free plan.", url: "https://betterstack.com" },
    ],
  },
  "OpenAlt": {
    facets: ["Analytics", "Productivity", "Communication", "Design", "Storage"],
    items: [
      { name: "Plausible (CE)", category: "Analytics", tag: "vs Google Analytics", blurb: "Lightweight, cookieless web analytics you can self-host.", url: "https://plausible.io" },
      { name: "Umami", category: "Analytics", tag: "vs Google Analytics", blurb: "Simple, privacy-focused analytics; one Docker command to run.", url: "https://umami.is", featured: true },
      { name: "Matomo", category: "Analytics", tag: "vs Google Analytics", blurb: "Full-featured GA alternative with heatmaps & funnels.", url: "https://matomo.org" },
      { name: "AppFlowy", category: "Productivity", tag: "vs Notion", blurb: "Open-source Notion alternative — your data, your rules.", url: "https://appflowy.io" },
      { name: "Joplin", category: "Productivity", tag: "vs Evernote", blurb: "Encrypted, markdown-first notes with sync you control.", url: "https://joplinapp.org" },
      { name: "Cal.com", category: "Productivity", tag: "vs Calendly", blurb: "Scheduling infrastructure you can self-host & white-label.", url: "https://cal.com" },
      { name: "Mattermost", category: "Communication", tag: "vs Slack", blurb: "Self-hosted team chat with channels, calls and playbooks.", url: "https://mattermost.com" },
      { name: "Jitsi Meet", category: "Communication", tag: "vs Zoom", blurb: "Free, encrypted video calls — no account needed.", url: "https://meet.jit.si" },
      { name: "Penpot", category: "Design", tag: "vs Figma", blurb: "Open-source design & prototyping, SVG-native.", url: "https://penpot.app", featured: true },
      { name: "Nextcloud", category: "Storage", tag: "vs Dropbox", blurb: "Self-hosted files, calendar, contacts — the whole suite.", url: "https://nextcloud.com" },
      { name: "MinIO", category: "Storage", tag: "vs S3", blurb: "S3-compatible object storage you run anywhere.", url: "https://min.io" },
    ],
  },
  "BoilerHub": {
    facets: ["Next.js", "Astro", "SaaS", "Mobile"],
    items: [
      { name: "create-t3-app", category: "Next.js", blurb: "Typesafe Next.js starter: tRPC, Prisma, Tailwind, Auth.js. Free & OSS.", url: "https://create.t3.gg", featured: true },
      { name: "Astro Starter Kit", category: "Astro", blurb: "Official minimal Astro template — the fastest static start.", url: "https://astro.new" },
      { name: "Supabase Starter", category: "SaaS", blurb: "Next.js + Supabase auth/db starter maintained by Supabase.", url: "https://github.com/vercel/next.js/tree/canary/examples/with-supabase" },
      { name: "Taxonomy", category: "Next.js", blurb: "shadcn's open-source Next.js 13 app-router reference build.", url: "https://github.com/shadcn-ui/taxonomy" },
      { name: "Epic Stack", category: "SaaS", blurb: "Kent C. Dodds' opinionated full-stack Remix starter.", url: "https://github.com/epicweb-dev/epic-stack" },
      { name: "Expo Starter", category: "Mobile", blurb: "Official Expo template for React Native apps with routing.", url: "https://docs.expo.dev" },
      { name: "SaaS Pegasus (paid)", category: "SaaS", blurb: "Django SaaS boilerplate — paid, but the docs alone teach the architecture.", url: "https://www.saaspegasus.com" },
      { name: "Open SaaS", category: "SaaS", blurb: "Free, open-source SaaS starter on Wasp with Stripe & analytics.", url: "https://opensaas.sh", featured: true },
    ],
  },
  "StartupPerks": {
    facets: ["Cloud credits", "Dev tools", "Marketing", "Finance"],
    items: [
      { name: "AWS Activate", category: "Cloud credits", blurb: "Up to $1k–$100k credits for eligible startups & founders.", url: "https://aws.amazon.com/activate/" },
      { name: "Google for Startups", category: "Cloud credits", blurb: "GCP credits up to $200k over two years for backed startups.", url: "https://cloud.google.com/startup" },
      { name: "Microsoft for Startups", category: "Cloud credits", blurb: "Azure credits + GitHub Enterprise + M365 for qualifying startups.", url: "https://www.microsoft.com/startups" },
      { name: "Notion for Startups", category: "Dev tools", blurb: "6 months free Plus plan with unlimited AI for eligible teams.", url: "https://www.notion.so/startups", featured: true },
      { name: "Stripe Atlas perks", category: "Finance", blurb: "Incorporation + a stack of partner deals (credits, fee waivers).", url: "https://stripe.com/atlas" },
      { name: "HubSpot for Startups", category: "Marketing", blurb: "Up to 75% off HubSpot in year one for eligible companies.", url: "https://www.hubspot.com/startups" },
      { name: "Mercury perks", category: "Finance", blurb: "Banking + partner rewards marketplace for startups.", url: "https://mercury.com" },
      { name: "Segment Startup Program", category: "Dev tools", blurb: "Free Segment + partner credits for early-stage teams.", url: "https://segment.com/industry/startups/" },
    ],
  },
  "SponsorList": {
    facets: ["Tech", "Business", "Design", "Finance"],
    items: [
      { name: "TLDR", category: "Tech", blurb: "Daily tech digest, 1M+ readers; self-serve sponsorships.", url: "https://tldr.tech/advertise" },
      { name: "Bytes", category: "Tech", blurb: "JavaScript newsletter, ~200k devs; humorous, high engagement.", url: "https://bytes.dev" },
      { name: "Morning Brew", category: "Business", blurb: "4M+ business readers; premium CPM, strong brand-side results.", url: "https://www.morningbrew.com/advertise" },
      { name: "The Hustle", category: "Business", blurb: "2M+ entrepreneurial readers, owned by HubSpot.", url: "https://thehustle.co" },
      { name: "Dense Discovery", category: "Design", blurb: "Thoughtful design/tech weekly with a loyal niche audience.", url: "https://www.densediscovery.com" },
      { name: "UI/UX tools weekly", category: "Design", blurb: "Curated tools list for designers; classified-style slots.", url: "#", featured: false },
      { name: "Milk Road", category: "Finance", blurb: "Crypto daily with sponsor slots; transparent audience stats.", url: "https://milkroad.com" },
      { name: "Indie Hackers newsletter", category: "Business", blurb: "Maker-focused digest; sponsorships reach bootstrappers.", url: "https://www.indiehackers.com" },
    ],
  },
};
// Generic seed for directories without a curated set.
const genericDirSeed = (idea) => ({
  facets: ["Editor's picks", "New"],
  items: Array.from({ length: 8 }).map((_, i) => ({
    name: `${idea.name} pick #${i + 1}`,
    category: i < 4 ? "Editor's picks" : "New",
    blurb: "Seeded entry — replace with a real curated listing before launch (see docs/LAUNCH-CHECKLIST.md).",
    url: "#",
    featured: i === 0,
  })),
});

/* ---------------- generate ---------------- */
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let pass = 0, fail = 0;
const statusProjects = {};
const errors = [];

// Prefer the curated seed file in data/directory-seeds/<slug>.json (richer, real entries),
// fall back to the inline DIR_SEED, then to the generic placeholder seed.
const seedFor = (idea, slug) => {
  const f = join(ROOT, "data", "directory-seeds", `${slug}.json`);
  if (existsSync(f)) {
    try {
      const j = JSON.parse(readFileSync(f, "utf8"));
      if (Array.isArray(j.items) && j.items.length) return { facets: j.facets ?? [], items: j.items };
    } catch (e) { console.warn(`! bad seed file ${f}: ${e.message}`); }
  }
  return DIR_SEED[idea.name] ?? genericDirSeed(idea);
};

ideas.forEach((idea, idx) => {
  const slug = SLUG_OVERRIDES[idea.name] ?? slugify(idea.name);
  const group = GROUP[idea.type] ?? "projects";
  const route = `/${group}/${slug}`;
  const [accent, accentInk] = PALETTE[idx % PALETTE.length];
  const renderAs = idea.type === "directory" ? "directory" : TOOL_IMPL[idea.name] ? "tool" : "offer";
  const seo = seoFor(idea);

  const cfg = {
    id: idea.rank ?? idea.id,
    slug,
    name: idea.name,
    category: idea.type,
    renderAs,
    route,
    accent, accentInk,
    eyebrow: idea.type,
    headline: idea.desc.replace(/\.$/, ""),
    subheadline: `${idea.why_pay}. Built for ${idea.target.toLowerCase()}.`,
    painPoint: idea.pain.endsWith(".") ? idea.pain : idea.pain + ".",
    solution: idea.desc,
    proofPoints: [
      idea.type === "productized service" ? "Fixed scope, fixed price" : "No signup required",
      idea.type === "template pack" ? "Instant download" : "Free-tier friendly",
      "14-day honest validation",
    ],
    features: featuresFor(idea),
    specs: specsFor(idea),
    pricing: tiersFor(idea),
    cta: ctaFor(idea),
    paymentLinkPlaceholder: "https://buy.stripe.com/TODO_REPLACE_ME",
    emailCapturePlaceholder: "https://tally.so/r/TODO_REPLACE_ME",
    ...(renderAs === "tool" ? { tool: TOOL_IMPL[idea.name] } : {}),
    ...(renderAs === "directory" ? { directory: { sponsorNote: "Get featured at the top of this list.", ...seedFor(idea, slug) } } : {}),
    seoTitle: seo.t,
    seoDescription: seo.d,
    keywords: [idea.name.toLowerCase(), ...String(idea.channel).toLowerCase().split(/,\s*/).slice(0, 2), idea.type],
    faq: faqFor(idea),
    launchChannel: idea.channel,
    validationMetric: idea.test,
    deploymentTarget: "Vercel (static) — primary; Cloudflare Pages / Netlify alternates",
    // assessment passthrough (handy for dashboard & growth docs)
    rank: idea.rank, frs: idea.frs, revenueSpeed: idea.rs, profitPotential: idea.pp,
    killCriteria: idea.kill, biggestRisk: idea.risk, first10: idea.first10, price: idea.price,
  };

  const parsed = ProjectConfigSchema.safeParse(cfg);
  if (!parsed.success) {
    fail++;
    errors.push({ slug, issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) });
    return;
  }
  pass++;
  const file = `project-${String(cfg.id).padStart(3, "0")}-${slug}.json`;
  writeFileSync(join(OUT_DIR, file), JSON.stringify({ ...cfg, ...parsed.data }, null, 2));
  statusProjects[slug] = { build: "pass", tests: "pending", deployed: false, issues: [] };
});

const status = {
  generatedAt: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
  phases: [
    { name: "Assessment", state: "done" },
    { name: "Architecture", state: "done" },
    { name: "Build 50", state: pass >= 50 ? "done" : "active" },
    { name: "QA", state: "pending" },
    { name: "Deploy", state: "pending" },
    { name: "Growth", state: "pending" },
  ],
  projects: statusProjects,
};
writeFileSync(STATUS, JSON.stringify(status, null, 2));

console.log(`generated ${pass} configs -> apps/web/src/data/projects/`);
if (fail) {
  console.error(`${fail} configs failed validation:`);
  errors.forEach((e) => console.error(`  - ${e.slug}: ${e.issues.join(" | ")}`));
  process.exit(1);
}
console.log("status.json written (dashboard will reflect it)");
