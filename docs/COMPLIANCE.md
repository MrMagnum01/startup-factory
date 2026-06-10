# Compliance Review

Boundaries this factory operates inside — and the things it deliberately refuses to do.

## Hard lines (non-negotiable)

1. **One account per platform.** No duplicate/fake accounts to multiply free tiers — that's fraud under most ToS (Vercel, Netlify, Cloudflare, Stripe all prohibit it) and the realistic outcome is losing every project at once when the account is banned.
2. **No deception toward buyers.** No fabricated testimonials, review manipulation, fake scarcity/countdowns, invented "as seen in" logos, or AI-generated "customer" photos. Pages may only claim what is true today.
3. **No spam.** Cold email: business-relevant, personalized, truthful sender identity, working unsubscribe/opt-out, no purchased lists (CAN-SPAM; GDPR/PECR are stricter in the EU — when emailing EU businesses, rely on legitimate interest narrowly: relevant offer, easy objection, delete on request). Communities: read each subreddit/Discord's self-promo rules before posting; value-first; disclose you're the builder.
4. **No secrets in code or chats.** Payment links and form IDs are public-safe; API keys/tokens are not. The repo contains only `TODO_REPLACE_ME` placeholders. Any token ever pasted into a chat or commit is compromised: revoke it immediately (github.com/settings/tokens) and issue a fresh one with minimal scopes.

## Per-category legal notes

| Category | Obligations |
|---|---|
| Productized services | Deliver the stated scope in the stated time; honor the stated refund. Keep simple invoices; income is taxable — track it from dollar one. |
| Template packs | You must own/have rights to everything in the pack. State the license clearly (personal/commercial). Honor the 14-day refund shown on pages. |
| Tools & calculators | Financial calculators (mortgage, FIRE, rates) carry "estimates, not financial advice" notes — keep them. PolicyGen output is explicitly "not legal advice" — keep that disclaimer. |
| Directories | Only factual, verifiable blurbs about third parties. Honor removal requests from listed companies. Mark featured/paid placements as such (FTC: paid placement must be distinguishable). Affiliate links: disclose ("contains affiliate links") near the links. |
| Lead-gen sites | Be transparent that requests are routed to partner providers. Don't collect more than the form shows. Privacy policy page required before running any ads; many ad platforms (Google/Meta) have extra rules for housing/credit/insurance verticals — read them before the optional day-8 ad test. |
| Waitlists/pre-orders | Pre-orders: state the expected delivery window and refund-on-non-delivery. Waitlist emails only get what they signed up for. |

## Platform free-tier reality (so nothing surprises you)

- **Vercel Hobby** is for personal, non-commercial use under their fair-use policy. This portfolio starts as an experiment, but **once real revenue flows, either upgrade to Pro ($20/mo) or move to Cloudflare Pages** (free tier is commercial-friendly, unlimited static bandwidth). The repo deploys to either unchanged.
- **Tally/Formspree** free tiers cap monthly submissions — a project getting real lead volume needs an upgrade or a switch (Tally Pro, or Formspree paid). The dashboard's form column tells you which projects depend on forms.
- **Gumroad** takes 10% flat; **Lemon Squeezy** 5%+50¢ acts as merchant of record (they handle VAT/sales tax — easiest international choice); **Stripe** 2.9%+30¢ leaves tax compliance to you (fine for US-ish B2B services; consider LS for digital products sold globally).
- **Umami Cloud / GA4** free tiers are fine at this scale. UptimeRobot free (50 monitors) covers everything.

## Privacy posture (what keeps this simple)

Static pages, no accounts, no databases. The only personal data touched: (a) form submissions stored in Tally/Formspree/Buttondown under their DPAs, (b) payment data handled entirely by Stripe/Gumroad/LS (we never see card numbers), (c) cookieless analytics if Umami/Plausible (GA4 needs a cookie notice in the EU). Each money-taking project should link a privacy page — generate a starting text with the site's own PolicyGen tool, then have it reviewed if/when revenue justifies it.

## Things this factory intentionally does NOT do

Loopholes/ToS workarounds (asked for, refused — the ban risk concentrates on the single GitHub/Vercel account everything depends on), trial-cycling with throwaway accounts, scraped/AI-fabricated directory data presented as curated, fake engagement (bought upvotes/reviews/followers), trademark-squatting names ("Notion™ templates" is fine as descriptive use; "NotionOfficial.shop" is not), and any paid API the free architecture doesn't need.
