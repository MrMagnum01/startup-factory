// Build-time loader: globs every generated project config into one typed list.
// 100% static — resolved by Vite at build, no runtime fetch, no DB.
const modules = import.meta.glob("../data/projects/*.json", { eager: true });

type P = any;
const all: P[] = Object.values(modules)
  .map((m: any) => m?.default ?? m)
  .filter((x: any) => x && x.slug);
all.sort((a, b) => (a.rank ?? a.id ?? 0) - (b.rank ?? b.id ?? 0));

export const projects = all;
export const getBySlug = (slug: string): P | undefined => all.find((p) => p.slug === slug);

export const GROUPS: Record<string, { base: string; label: string; blurb: string }> = {
  projects: { base: "/projects", label: "All projects", blurb: "Every offer in the factory." },
  tools: { base: "/tools", label: "Micro-tools", blurb: "Free client-side tools — nothing leaves your browser." },
  directories: { base: "/directories", label: "Directories", blurb: "Curated, searchable lists worth bookmarking." },
  templates: { base: "/templates", label: "Template packs", blurb: "Instant-download systems and swipe files." },
  services: { base: "/services", label: "Services", blurb: "Fixed-scope, fixed-price, done-for-you." },
};

export const groupOf = (p: P): string => (p?.route || "/projects/x").split("/")[1] || "projects";
export const inGroup = (g: string): P[] => all.filter((p) => groupOf(p) === g);
export const categories = (): string[] => Array.from(new Set(all.map((p) => p.category)));
