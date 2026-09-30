import Link from 'next/link';
import HeaderNav from './HeaderNav';
import { readableOn } from '../lib/format';
import { site } from '../lib/content';

export function PublicShell({ children, home = false }) {
  const footerLinks = site.navigation.filter((item) => item.href !== '/').slice(0, 4);
  const accent = site.theme.accent;
  return <div className={`site-shell${home ? ' site-shell-home' : ''}`} style={{ '--accent': accent, '--on-accent': readableOn(accent) }}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${site.brand.name} home`}>
          {site.brand.logoImage
            ? <img className="brand-logo-image" src={site.brand.logoImage} alt="" />
            : <span className="brand-mark-text" aria-hidden="true">{site.brand.logoText}</span>}
          <span className="brand-copy"><strong>{site.brand.name}</strong><small>{site.ui.headerTagline}</small></span>
        </Link>
        <HeaderNav navigation={site.navigation} councilLabel={site.ui.councilTab} facultyLabel={site.ui.facultyTab} />
      </div>
    </header>
    {children}
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-identity"><strong>{site.brand.name}</strong><span>{site.footer.text}</span></div>
        <div className="footer-note"><span>{site.footer.note}</span><small>© {new Date().getFullYear()} {site.brand.name}</small></div>
        <nav className="footer-links" aria-label="Footer">{footerLinks.map((item, index) => <Link key={`${item.href}-${index}`} href={item.href}>{item.label}</Link>)}</nav>
      </div>
    </footer>
  </div>;
}
