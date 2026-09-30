import { siteOrigin } from '../lib/origin';

export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${siteOrigin()}/sitemap.xml` };
}
