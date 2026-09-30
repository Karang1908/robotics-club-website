import { PublicShell } from './PublicShell';

export function InnerPage({ site, active, title, description, children, className = '' }) {
  return <PublicShell site={site} active={active}><main className={`inner-main ${className}`}><div className="inner-heading"><span className="inner-line" /><h1>{title}</h1><p>{description}</p></div>{children}</main></PublicShell>;
}
