// @factory/analytics — privacy-first analytics resolver (Plausible / Umami / GA / Vercel).
// Reads PUBLIC_* env at build time. Returns a descriptor the Base layout renders.
// All providers here have a legal free tier; default = none (no tracking) until configured.

export function getAnalytics(env = {}) {
  const e = env || {};
  if (e.PUBLIC_PLAUSIBLE_DOMAIN) {
    return {
      provider: "plausible",
      domain: e.PUBLIC_PLAUSIBLE_DOMAIN,
      src: e.PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js",
    };
  }
  if (e.PUBLIC_UMAMI_ID) {
    return {
      provider: "umami",
      websiteId: e.PUBLIC_UMAMI_ID,
      src: e.PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js",
    };
  }
  if (e.PUBLIC_GA_ID) {
    return { provider: "ga", id: e.PUBLIC_GA_ID };
  }
  // Vercel Web Analytics is enabled in the Vercel dashboard (no snippet needed for static).
  return { provider: "none" };
}

/** A tiny client event helper string, exposed as window.track(name, props). */
export const trackHelper = `
window.track=function(n,p){try{
  if(window.plausible)window.plausible(n,{props:p||{}});
  if(window.umami)window.umami.track(n,p||{});
  if(window.gtag)window.gtag('event',n,p||{});
}catch(e){}};`;
