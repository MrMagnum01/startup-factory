// Retired: OG cards are pre-rendered PNGs in /public/og/ (social platforms reject SVG og:image).
export function getStaticPaths() { return []; }
export const GET = () => new Response("", { status: 404 });
