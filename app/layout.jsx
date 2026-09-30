import './globals.css';
import './overrides.css';
import './light.css';
import { getSite } from '../lib/store';

export async function generateMetadata() {
  const site = await getSite();
  return { title: site.seo.title, description: site.seo.description };
}

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
