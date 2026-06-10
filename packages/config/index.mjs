// @factory/config — the single contract every project config must satisfy.
// ESM + zod so BOTH the Astro app and the Node generator/validator scripts use one source of truth.
import { z } from "zod";

export const CATEGORIES = [
  "landing page", "micro-tool", "calculator", "directory",
  "template pack", "generator", "lead-gen site", "productized service", "mini SaaS",
];

export const RENDER_AS = ["offer", "directory", "tool"];

export const CtaSchema = z.object({
  // What the primary button does. Drives which CTA component renders.
  type: z.enum(["payment", "waitlist", "leadform", "download", "tool"]),
  label: z.string().min(1),
  href: z.string().default("#"), // placeholder; real link is a TODO at deploy time
  note: z.string().optional(),
});

export const FaqSchema = z.object({ q: z.string().min(1), a: z.string().min(1) });

export const FeatureSchema = z.object({ title: z.string().min(1), body: z.string().min(1) });

export const SpecSchema = z.object({ k: z.string().min(1), v: z.string().min(1) });

export const PriceTierSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  cadence: z.string().optional(),
  summary: z.string().optional(),
  features: z.array(z.string()).default([]),
  highlighted: z.boolean().default(false),
  cta: CtaSchema.optional(),
});

export const DirectoryItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().default(""),
  tag: z.string().default(""),
  blurb: z.string().default(""),
  url: z.string().default("#"),
  featured: z.boolean().default(false),
});

export const ProjectConfigSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug"),
  name: z.string().min(1),
  category: z.enum(CATEGORIES),
  renderAs: z.enum(RENDER_AS),
  route: z.string().regex(/^\/.+/, "must start with /"),
  accent: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#15634C"),
  accentInk: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#0B2A20"),

  eyebrow: z.string().default(""),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  painPoint: z.string().min(1),
  solution: z.string().min(1),
  proofPoints: z.array(z.string()).default([]),
  features: z.array(FeatureSchema).default([]),
  specs: z.array(SpecSchema).default([]),

  pricing: z.object({
    note: z.string().default(""),
    tiers: z.array(PriceTierSchema).default([]),
  }).default({ note: "", tiers: [] }),

  cta: CtaSchema,
  paymentLinkPlaceholder: z.string().default("https://buy.stripe.com/TODO_REPLACE_ME"),
  emailCapturePlaceholder: z.string().default("https://tally.so/r/TODO_REPLACE_ME"),

  // renderAs:"tool" -> which client-side tool module to mount
  tool: z.string().optional(),
  // renderAs:"directory" -> seeded entries + filter facets
  directory: z.object({
    facets: z.array(z.string()).default([]),
    items: z.array(DirectoryItemSchema).default([]),
    sponsorNote: z.string().default("Featured listing slots available."),
  }).optional(),

  seoTitle: z.string().min(1).max(70, "keep <=70 chars for SERP"),
  seoDescription: z.string().min(1).max(165, "keep <=165 chars for SERP"),
  keywords: z.array(z.string()).default([]),
  faq: z.array(FaqSchema).default([]),

  launchChannel: z.string().min(1),
  validationMetric: z.string().min(1),
  deploymentTarget: z.string().default("Vercel (static) — primary; Cloudflare Pages / Netlify alternates"),
});

/** Validate one config; throws a readable error on failure. */
export function parseProject(obj) {
  return ProjectConfigSchema.parse(obj);
}

/** Safe-validate; returns {success, data|error}. */
export function safeParseProject(obj) {
  return ProjectConfigSchema.safeParse(obj);
}

export default ProjectConfigSchema;
