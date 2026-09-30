import { siteOrigin } from '../lib/origin';

const paths = ['/', '/members/council', '/members/faculty', '/news', '/lab-facilities', '/contact'];

export default function sitemap() {
  const origin = siteOrigin();
  return paths.map((path) => ({ url: `${origin}${path === '/' ? '' : path}`, changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.7 }));
}
