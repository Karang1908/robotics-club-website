'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function HeaderNav({ navigation, councilLabel, facultyLabel }) {
  const pathname = usePathname();
  const root = useRef(null);
  const toggle = useRef(null);
  const membersButton = useRef(null);
  const openedByHover = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setMembersOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !membersOpen) return undefined;
    function handlePointer(event) {
      if (!root.current?.contains(event.target)) {
        setMenuOpen(false);
        setMembersOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key !== 'Escape') return;
      (membersOpen ? membersButton : toggle).current?.focus();
      setMenuOpen(false);
      setMembersOpen(false);
    }
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen, membersOpen]);

  function closeMenus() {
    setMenuOpen(false);
    setMembersOpen(false);
  }

  const memberLink = (href, label, note) => (
    <Link href={href} className={pathname === href ? 'current' : ''} aria-current={pathname === href ? 'page' : undefined} onClick={closeMenus}>
      <strong>{label}</strong><small>{note}</small>
    </Link>
  );

  return <div className="header-navigation" ref={root}>
    <button ref={toggle} className="mobile-nav-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} onClick={() => { setMenuOpen((value) => !value); setMembersOpen(false); }}>
      <span className="menu-icon" aria-hidden="true"><span /><span /></span>
      <span>{menuOpen ? 'Close' : 'Menu'}</span>
    </button>
    <nav id="site-navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main">
      {navigation.map((item, index) => item.href.startsWith('/members')
        ? <div
            className={`nav-members${pathname.startsWith('/members') ? ' active' : ''}`}
            key={`${item.href}-${index}`}
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') { openedByHover.current = true; setMembersOpen(true); } }}
            onPointerLeave={(event) => { if (event.pointerType === 'mouse') { openedByHover.current = false; setMembersOpen(false); } }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMembersOpen(false); }}
          >
            <button
              ref={membersButton}
              className="nav-members-button"
              type="button"
              aria-expanded={membersOpen}
              aria-controls="member-subnav"
              onClick={() => {
                // A mouse click on a menu that hover just opened should keep it open, not close it.
                if (openedByHover.current) { openedByHover.current = false; return; }
                setMembersOpen((value) => !value);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowDown') return;
                event.preventDefault();
                setMembersOpen(true);
                requestAnimationFrame(() => root.current?.querySelector('#member-subnav a')?.focus());
              }}
            >
              {item.label}
              <svg className="nav-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div id="member-subnav" className="member-dropdown" hidden={!membersOpen}>
              {memberLink('/members/council', councilLabel, 'Student leadership')}
              {memberLink('/members/faculty', facultyLabel, 'Faculty advisers')}
            </div>
          </div>
        : <Link key={`${item.href}-${index}`} href={item.href} className={`nav-link${pathname === item.href ? ' active' : ''}`} aria-current={pathname === item.href ? 'page' : undefined} onClick={closeMenus}>{item.label}</Link>
      )}
    </nav>
  </div>;
}
