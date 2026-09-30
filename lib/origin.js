// The public address of the site, used for link previews and the sitemap. Vercel provides it
// (including a custom domain); SITE_ORIGIN overrides it if you ever need to.
export function siteOrigin() {
  const explicit = process.env.SITE_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}
