'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function HeaderNav({ navigation, councilLabel, facultyLabel }) {
  const pathname = usePathname();
  const root = useRef(null);
  const membersButton = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setMembersOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointer(event) {
      if (!root.current?.contains(event.target)) {
        setMenuOpen(false);
        setMembersOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setMembersOpen(false);
        if (root.current?.contains(document.activeElement)) membersButton.current?.focus();
      }
    }
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  function closeMenus() {
    setMenuOpen(false);
    setMembersOpen(false);
  }

  return <div className="header-navigation" ref={root}>
    <button className="mobile-nav-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} onClick={() => { setMenuOpen((value) => !value); setMembersOpen(false); }}>
      <span className="menu-icon" aria-hidden="true"><span /><span /></span>
      <span>{menuOpen ? 'Close' : 'Menu'}</span>
    </button>
    <nav id="site-navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
      {navigation.map((item, index) => item.href.startsWith('/members') ?
        <div className={`nav-members${pathname.startsWith('/members') ? ' active' : ''}`} key={`${item.href}-${index}`} onMouseLeave={() => setMembersOpen(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMembersOpen(false); }}>
          <button ref={membersButton} className="nav-members-button" type="button" aria-expanded={membersOpen} aria-controls="member-subnav" onClick={() => setMembersOpen((value) => !value)} onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setMembersOpen(true);
              requestAnimationFrame(() => root.current?.querySelector('#member-subnav a')?.focus());
            }
          }}>
            {item.label}<svg className="nav-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div id="member-subnav" className="member-dropdown" hidden={!membersOpen}>
            <Link href="/members/council" className={pathname === '/members/council' ? 'current' : ''} aria-current={pathname === '/members/council' ? 'page' : undefined} onClick={closeMenus}><span className="member-dropdown-copy"><strong>{councilLabel}</strong><small>Student leadership</small></span></Link>
            <Link href="/members/faculty" className={pathname === '/members/faculty' ? 'current' : ''} aria-current={pathname === '/members/faculty' ? 'page' : undefined} onClick={closeMenus}><span className="member-dropdown-copy"><strong>{facultyLabel}</strong><small>Faculty advisers</small></span></Link>
          </div>
        </div> :
        <Link key={`${item.href}-${index}`} href={item.href} className={`nav-link${pathname === item.href ? ' active' : ''}`} aria-current={pathname === item.href ? 'page' : undefined} onClick={closeMenus}>{item.label}</Link>
      )}
    </nav>
  </div>;
}
