export function ArrowIcon({ diagonal = false, size = 18 }) {
  return diagonal
    ? <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function ChevronIcon({ left = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={left ? { transform: 'rotate(180deg)' } : undefined}><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function MarkIcon() {
  return <svg className="brand-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="1" y="1" width="42" height="42" rx="10" stroke="currentColor" strokeWidth="1.5" /><path d="M13 31V13h9.6c5.5 0 8.4 2.7 8.4 7 0 3-1.5 5.2-4.1 6.2L32 31h-6l-4.6-4.3H18V31h-5Zm5-9h4.7c2.3 0 3.4-.8 3.4-2.3 0-1.6-1.1-2.4-3.4-2.4H18V22Z" fill="currentColor"/><circle cx="33" cy="11" r="2.2" fill="currentColor" /></svg>;
}
