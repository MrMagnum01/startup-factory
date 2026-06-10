// @factory/forms — resolves email-capture / lead-form endpoints.
// Works with Formspree, Tally, Buttondown, Google Forms (all free-tier, no backend).
// Endpoints are placeholders (TODO) until you paste your real form ID.

const PLACEHOLDER = /TODO|REPLACE_ME/i;

export function isPlaceholder(href = "") {
  return !href || PLACEHOLDER.test(href);
}

/** Decide how to render a capture: hosted redirect (Tally/Buttondown) vs POST form (Formspree). */
export function resolveForm(project) {
  const endpoint = project?.emailCapturePlaceholder || "";
  const placeholder = isPlaceholder(endpoint);
  const isFormspree = /formspree\.io/i.test(endpoint);
  const isPost = isFormspree; // Formspree accepts POST; others are hosted links
  return {
    endpoint: endpoint || "#",
    method: isPost ? "POST" : "GET",
    mode: isPost ? "post" : "redirect",
    placeholder,
    provider: isFormspree ? "formspree" : /tally\.so/i.test(endpoint) ? "tally"
      : /buttondown/i.test(endpoint) ? "buttondown" : "generic",
  };
}

/** Hidden context fields so submissions are attributable to the project. */
export function hiddenFields(project) {
  return [
    { name: "_project", value: project?.slug || "" },
    { name: "_source", value: "startup-factory" },
  ];
}
