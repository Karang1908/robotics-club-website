import Link from 'next/link';
import HeaderNav from './HeaderNav';

export function PublicShell({ site, children, home = false }) {
  const footerLinks = site.navigation.filter((item) => item.href !== '/').slice(0, 4);
  return <div className={`site-shell${home ? ' site-shell-home' : ''}`} style={{ '--accent': site.theme.accent }}>
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${site.brand.name} home`}>
        {site.brand.logoImage ? <img className="brand-logo-image" src={site.brand.logoImage} alt="" /> : <span className="brand-mark-text" aria-hidden="true">{site.brand.logoText}</span>}
        <span className="brand-copy"><strong>{site.brand.name}</strong><small>{site.ui.headerTagline}</small></span>
      </Link>
      <HeaderNav navigation={site.navigation} councilLabel={site.ui.councilTab} facultyLabel={site.ui.facultyTab} />
    </header>
    {children}
    <footer className="site-footer">
      <div className="footer-identity"><strong>{site.brand.name}</strong><span>{site.footer.text}</span></div>
      <div className="footer-note"><span>{site.footer.note}</span><small>© {new Date().getFullYear()} {site.brand.name}</small></div>
      <nav className="footer-links" aria-label="Footer navigation">{footerLinks.map((item, index) => <Link key={`${item.href}-${index}`} href={item.href}>{item.label}</Link>)}</nav>
    </footer>
  </div>;
}
