import { PublicShell } from './PublicShell';

export function InnerPage({ title, description, children, className = '' }) {
  return <PublicShell>
    <main id="main" className={`inner-main container ${className}`}>
      <header className="inner-heading"><h1>{title}</h1><p>{description}</p></header>
      {children}
    </main>
  </PublicShell>;
}
