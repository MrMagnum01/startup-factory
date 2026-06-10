# Launch Checklist

Work in **waves of 3–5 projects**, not all 50 at once. A project is "launched" only when every box below is ticked. The dashboard (`/dashboard`) shows which projects still carry TODOs.

## Wave 0 — once, for the whole site

- [ ] Deployed to Vercel, `SITE_URL` env set, custom domain if you have one
- [ ] Analytics live (Umami/GA/Vercel) — verify a pageview registers
- [ ] Google Search Console: property added, `sitemap-index.xml` submitted
- [ ] UptimeRobot monitors added (5 key URLs)
- [ ] CI green on `main`

## Per-project activation (15–30 min each)

**Money path**
- [ ] Create the real payment link: Stripe Payment Link (services) / Gumroad or Lemon Squeezy product (templates/Pro unlocks) — correct price, name, receipt email
- [ ] For template packs: the actual deliverable file uploaded to Gumroad/LS (zip with README + license)
- [ ] For services: intake form (Tally) or Calendly linked from the post-purchase page; you can deliver the promised scope in 48–72h
- [ ] Replace `paymentLinkPlaceholder` / `cta.href` in `apps/web/src/data/projects/project-XXX-<slug>.json` — or better, in `scripts/generate-projects.mjs` overrides so regeneration keeps it
- [ ] Test purchase end-to-end (Stripe test mode, then one live $1 test if nervous)

**Capture path**
- [ ] Create the real form (Tally/Formspree/Buttondown) with `_project` hidden field kept
- [ ] Replace `emailCapturePlaceholder` in the config
- [ ] Submit a test entry, confirm it arrives

**Page truth pass**
- [ ] Every claim on the page is true TODAY (no invented testimonials, no fake counts, no fake scarcity)
- [ ] Price on page == price at checkout
- [ ] Refund promise on page == what you'll actually honor
- [ ] Directory projects: every seeded entry verified (URL live, blurb accurate); remove any you can't verify

**Re-verify**
- [ ] `pnpm build && node scripts/check-links.mjs` — project shows zero TODOs
- [ ] `/dashboard` row is fully green for this project
- [ ] OG card renders when shared

## Announcing (per project — see docs/GROWTH.md for copy)

- [ ] 1 community post where the audience actually lives (follow that community's self-promo rules — read them first)
- [ ] 1 X/Twitter + 1 LinkedIn post
- [ ] Services: first 20 personalized outreach emails sent (no purchased lists; comply with CAN-SPAM/GDPR — real identity, easy opt-out)
- [ ] Tools/directories: submitted to 2–3 relevant tool/directory aggregators
- [ ] Validation metric + kill date noted in your tracker (defaults in each config's `validationMetric` / assessment kill criteria)

## Kill discipline

On each project's day-14 review: if it missed its kill criteria — stop promoting it, strip it from the homepage featured list, keep the page live only if it costs nothing. Re-allocate the hours to whatever is showing pull. Killing fast is the strategy, not a failure.
