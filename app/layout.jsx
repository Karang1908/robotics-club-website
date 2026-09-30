import localFont from 'next/font/local';
import './globals.css';
import { site } from '../lib/content';
import { siteOrigin } from '../lib/origin';

const sans = localFont({
  src: './fonts/DM-Sans.woff2',
  variable: '--font-sans',
  weight: '400 700',
  display: 'swap',
});

// Pages are built once and served from the CDN. Rebuilding daily keeps the footer year current.
export const revalidate = 86400;

const { title, description } = site.seo;
const image = site.robots.find((robot) => robot.image)?.image;

export const metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: title, template: `%s | ${site.brand.name}` },
  description,
  openGraph: { title, description, siteName: site.brand.name, type: 'website', locale: 'en_AE', ...(image && { images: [{ url: image }] }) },
  twitter: { card: image ? 'summary_large_image' : 'summary', title, description },
};

export const viewport = { themeColor: site.theme.accent };

export default function RootLayout({ children }) {
  return <html lang="en" className={sans.variable}><body>{children}</body></html>;
}
