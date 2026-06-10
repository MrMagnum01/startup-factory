// @factory/seo — builds canonical URLs, OpenGraph/Twitter tags and JSON-LD.
// Pure functions, no deps. Consumed by the Base layout.

const clean = (s = "") => String(s).replace(/\s+/g, " ").trim();

export function absUrl(site, path = "/") {
  try { return new URL(path, site).toString().replace(/\/$/, "") || site; }
  catch { return site; }
}

export function ogImageUrl(site, project) {
  // Branded PNG cards are pre-rendered at generate time into /public/og/ (see scripts/generate-og.py).
  if (project?.slug) return absUrl(site, `/og/${project.slug}.png`);
  return absUrl(site, "/og/default.png");
}

/** Build the <head> meta model for a page. */
export function buildMeta({ site, path = "/", title, description, project, type = "website", image }) {
  const url = absUrl(site, path);
  const img = image || ogImageUrl(site, project);
  return {
    title: clean(title),
    description: clean(description),
    canonical: url,
    image: img,
    og: {
      "og:type": type,
      "og:site_name": "Startup Factory",
      "og:title": clean(title),
      "og:description": clean(description),
      "og:url": url,
      "og:image": img,
    },
    twitter: {
      "twitter:card": "summary_large_image",
      "twitter:title": clean(title),
      "twitter:description": clean(description),
      "twitter:image": img,
    },
  };
}

/** JSON-LD graph for a project page: Product/Service + FAQPage + Breadcrumbs. */
export function buildJsonLd({ site, path, project }) {
  const url = absUrl(site, path);
  const graph = [];

  const isOffer = project?.renderAs === "offer";
  const priceTier = project?.pricing?.tiers?.[0];
  const numericPrice = priceTier?.price ? (priceTier.price.match(/[\d.]+/)?.[0] ?? "") : "";

  if (project?.category === "productized service") {
    graph.push({
      "@type": "Service", name: project.name, serviceType: project.category,
      description: project.seoDescription, url,
      provider: { "@type": "Organization", name: "Startup Factory" },
      ...(numericPrice ? { offers: { "@type": "Offer", price: numericPrice, priceCurrency: "USD" } } : {}),
    });
  } else if (isOffer) {
    graph.push({
      "@type": "Product", name: project.name, description: project.seoDescription, url,
      ...(numericPrice ? { offers: { "@type": "Offer", price: numericPrice, priceCurrency: "USD", availability: "https://schema.org/InStock" } } : {}),
    });
  } else {
    graph.push({
      "@type": "WebApplication", name: project?.name, description: project?.seoDescription,
      url, applicationCategory: "BusinessApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  }

  if (project?.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: project.faq.map((f) => ({
        "@type": "Question", name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function siteJsonLd({ site }) {
  return {
    "@context": "https://schema.org", "@type": "WebSite",
    name: "Startup Factory", url: absUrl(site, "/"),
  };
}
