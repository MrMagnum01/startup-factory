// @factory/payments — resolves a project's primary CTA into a concrete link.
// Supports Stripe Payment Links, Gumroad, Lemon Squeezy, Ko-fi (all have hosted checkout — no server, no PCI scope).
// Every unresolved link returns a clearly-marked TODO placeholder so QA can flag it.

const PLACEHOLDER = /TODO|REPLACE_ME|^#$/i;

export function isPlaceholder(href = "") {
  return !href || PLACEHOLDER.test(href);
}

/**
 * @returns {{href:string,label:string,type:string,external:boolean,rel?:string,target?:string,placeholder:boolean,note?:string}}
 */
export function resolveCta(project) {
  const cta = project?.cta || { type: "payment", label: "Get started", href: "#" };
  let href = cta.href && cta.href !== "#" ? cta.href : "";

  switch (cta.type) {
    case "payment":
    case "download":
      href = href || project?.paymentLinkPlaceholder || "#";
      break;
    case "waitlist":
      href = href || project?.emailCapturePlaceholder || "#";
      break;
    case "leadform":
      href = "#lead"; // scrolls to the on-page lead form
      break;
    case "tool":
      href = "#tool"; // scrolls to the on-page tool
      break;
    default:
      href = href || "#";
  }

  const placeholder = isPlaceholder(href) && cta.type !== "leadform" && cta.type !== "tool";
  const external = /^https?:/i.test(href);
  return {
    href,
    label: cta.label,
    type: cta.type,
    note: cta.note,
    external,
    placeholder,
    comingSoon: placeholder,
    ...(external ? { rel: "noopener", target: "_blank" } : {}),
  };
}

export const PAYMENT_PROVIDERS = [
  { id: "stripe", name: "Stripe Payment Link", url: "https://buy.stripe.com/…", fee: "2.9% + 30¢", note: "No server needed; hosted checkout." },
  { id: "gumroad", name: "Gumroad", url: "https://gumroad.com/l/…", fee: "10% flat", note: "Best for digital downloads & license keys." },
  { id: "lemonsqueezy", name: "Lemon Squeezy", url: "https://…lemonsqueezy.com", fee: "5% + 50¢", note: "Merchant of record — handles global tax." },
  { id: "kofi", name: "Ko-fi", url: "https://ko-fi.com/…", fee: "0% (free tier)", note: "Tips, downloads, simple shop." },
];
