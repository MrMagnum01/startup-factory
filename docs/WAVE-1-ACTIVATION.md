# Wave 1 Activation — the three fastest-revenue bets

ResumeRev (FRS 7.7) · GBP Launch (7.65) · ShopSpeed Fix (7.6). All three are fixed-scope services sold via outreach — the only category that realistically takes money inside 14 days. Budget: ~90 minutes of setup, then 45–60 min/day of outreach.

**Honesty first:** these convert on the strength of YOUR fulfillment. Only activate a service you can actually deliver in 48–72h. If you can't audit a Shopify store's speed, activate ResumeRev + GBP only — two done well beat three done badly.

---

## 1 · ResumeRev — ATS resume rewrite, $99 · `/services/resume-rewrite`

**Stripe** (stripe.com → Product catalog → Add product → "Create payment link"):
- Name: `ResumeRev — ATS Resume Rewrite (48h)`
- Price: **$99 one-time** (page also offers $129 rush — create a second link if you want the tier)
- Description: `Full rewrite of one resume for ATS compatibility: keyword alignment to a target role, quantified bullet rewrites, clean parseable format. Delivered in 48 hours with one revision round included.`
- After payment → Confirmation page → "Don't show confirmation page" → redirect to your Tally intake (next step).

**Tally intake** (tally.so → New form, free tier):
Questions: Name · Email · Upload current resume (file) · Link or paste the job posting you're targeting · Anything to emphasize? (long text) · Hidden field `_project=resume-rewrite`.

**Paste links** in `apps/web/src/data/projects/project-001-resume-rewrite.json`:
- `"paymentLinkPlaceholder"` → your Stripe link (also `cta.href`)
- `"emailCapturePlaceholder"` → your Tally link
Better long-term: put them in `scripts/generate-projects.mjs` (search `TODO_REPLACE_ME`) so regeneration keeps them. Rebuild + redeploy.

**First 20 prospects:** r/resumes + r/jobsearchhacks "resume review" daily threads (give 3 genuinely useful free critiques/day, link only in profile or when asked — read each sub's rules); LinkedIn: search "open to work" in your 2nd-degree network, offer one free bullet rewrite as the hook; 5 career-pivot Discord servers.

**Day-1 outreach template** (after a free mini-critique):
> Glad the tips helped. If you want the full thing done for you: I rewrite the whole resume for ATS + your target role, 48h turnaround, $99, one revision included — [link]. No pressure either way.

---

## 2 · GBP Launch — Google Business Profile setup, $129 · `/services/google-business-profile-setup`

**Stripe:** Name `GBP Launch — Google Business Profile Setup & Optimization` · **$129 one-time** · Description: `Complete setup or rescue of your Google Business Profile: categories, services, photos guidance, posts, review-reply templates, and a 30-day local visibility checklist. Delivered in 72 hours.`

**Tally intake:** Business name · Address/area served · Phone · Website (if any) · Google account email to share access with · Current GBP link if one exists.

**Paste links** in `project-002-google-business-profile-setup.json` (same two fields as above).

**First 20 prospects:** Google Maps in your city → search a service ("plumber", "dentist", "café") → find businesses with no website link, few photos, no posts, unanswered reviews → those are the pitch list. Email/call/walk in.

**Cold email:**
> Subject: your Google listing — 2 things
>
> Hi {name}, I was looking for a {trade} in {area} and noticed {business} comes up on Maps with {specific gap: no photos / 3-year-old info / unanswered reviews}. That usually costs walk-ins — most people pick from the top 3 complete profiles.
>
> I fix exactly this: full profile setup + optimization, done in 72h, flat $129. Here's what's included: {link}. Worth it?
>
> {your name} · {phone}

---

## 3 · ShopSpeed Fix — Shopify speed optimization, $249 · `/services/shopify-speed-fix`

**Stripe:** Name `ShopSpeed Fix — Shopify Speed Optimization` · **$249 one-time** · Description: `Speed audit + implementation on one Shopify store: image compression, app/script cleanup, theme-level fixes, lazy loading. Before/after Lighthouse report included. Delivered in 72 hours.`

**Tally intake:** Store URL · Platform confirmation (Shopify/other) · Collaborator access email · Biggest complaint (slow pages? checkout?) · Revenue range (optional).

**Paste links** in `project-003-shopify-speed-fix.json`.

**First 20 prospects:** Shopify store directories + #shopify hashtag shops on Instagram → run their homepage through PageSpeed Insights → screenshot any score under 50 → that screenshot IS the outreach. Also r/shopify (rules!), Shopify community forums, DTC Twitter.

**Cold email:**
> Subject: {store} loads in {X}s on mobile
>
> Hi {name}, I ran {store} through Google's PageSpeed test — attached. Mobile score {score}; Google's data says a big share of visitors bounce before a {X}s load finishes, which silently taxes every ad dollar.
>
> I fix this for a flat $249: theme + image + script optimization, before/after report, 72h. Details: {link}. Want the full audit either way? It's free, no strings.

---

## The week, scheduled

| Day | Do |
|---|---|
| 1 | Stripe + Tally for all three (90 min). Paste links, rebuild, redeploy. Test-buy one ($1 test or Stripe test mode). |
| 2 | Build the three 20-prospect lists (60 min). Send first 10 touches (ResumeRev free critiques + 5 GBP emails). |
| 3 | 15 touches: 5 critiques, 5 GBP, 5 ShopSpeed (with PageSpeed screenshots). |
| 4 | 15 touches + follow-up #1 on day-2 contacts (one-line bump). |
| 5 | 15 touches + follow-ups. Post one genuinely useful teardown thread (resume mistakes / GBP gaps / speed myths) in one community. |
| 6 | 15 touches. Tally check: reply to every intake within 2h. |
| 7 | Review on /dashboard + a notes file: replies? calls? orders? Kill criteria check is day 14, but if one service has 0 replies after ~50 touches, fix the pitch before sending more. |

**Targets by day 14** (from the assessment): ≥1 paid order or ≥3 booked calls per service after ~100 touches. Miss both → that service goes to the kill list, hours move to whatever pulled.
